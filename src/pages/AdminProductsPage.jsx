import React, { useContext, useState } from 'react'
import { ProductContext } from '../context/ProductContext'
import { Helmet } from 'react-helmet-async'
import { FaEdit, FaPlus, FaTrash, FaUpload } from 'react-icons/fa'


const initialForm =
{
    title: "",
    description: "",
    price: "",
    image: ""
}
export const AdminProductsPage = () => {
    //linea para migrar los productos que estan cargados en el productos.json
    const { migrateProductsFromJson } = useContext(ProductContext)
    const {
        products,
        addProduct,
        editProduct,
        deleteProduct,
        loadingProducts,
    } = useContext(ProductContext)

    const [form, setForm] = useState(initialForm)
    const [editingId, setEditingId] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewImage, setPreviewImage] = useState("")
    const [uploadingImage, setUploadingImage] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const handleChange = ({ target }) => {
        setForm({
            ...form,
            [target.name]: target.value
        })

        if (target.name === "image") {
            setPreviewImage(target.value)
            setSelectedFile(null)
        }
    }

    const validateImageFile = (file) => {
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

        if (!validTypes.includes(file.type)) {
            Swal.fire({
                icon: "warning",
                title: "Formato no válido",
                text: "Solo se permiten imágenes JPG, PNG o WEBP"
            })
            return false
        }

        if (file.size > 2 * 1024 * 1024) {
            Swal.fire({
                icon: "warning",
                title: "Imagen demasiado pesada",
                text: "La imagen no debe superar los 2MB"
            })
            return false
        }

        return true
    }

    const handleFileSelection = (file) => {
        if (!file) return

        if (!validateImageFile(file)) return

        setSelectedFile(file)
        setPreviewImage(URL.createObjectURL(file))

        setForm({
            ...form,
            image: ""
        })
    }

    const handleFileChange = ({ target }) => {
        handleFileSelection(target.files[0])
    }

    const handleDragOver = (event) => {
        event.preventDefault()
        setDragActive(true)
    }

    const handleDragLeave = () => {
        setDragActive(false)
    }

    const handleDrop = (event) => {
        event.preventDefault()
        setDragActive(false)

        const file = event.dataTransfer.files[0]
        handleFileSelection(file)
    }

    const uploadImageToFirebase = async () => {
        if (!selectedFile) return form.image

        setUploadingImage(true)

        try {
            const fileName = `${Date.now()}-${selectedFile.name}`
            const storageRef = ref(storage, `products/${fileName}`)

            await uploadBytes(storageRef, selectedFile)

            const imageUrl = await getDownloadURL(storageRef)

            return imageUrl
        } catch (error) {
            console.error(error)

            Swal.fire({
                icon: "error",
                title: "Error al subir imagen",
                text: "No se pudo cargar la imagen en Firebase Storage"
            })

            return null
        } finally {
            setUploadingImage(false)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!form.title.trim()) {
            alert("El Nombre del Producto es obligatorio")
            return
        }

        if (Number(form.price) <= 0) {
            alert("El Precio debe ser mayor a cero")
            return
        }

        const imageUrl = await uploadImageToFirebase()

        if (!imageUrl) {
            alert("Debes cargar una imagen o ingresar una URL válida")
            return
        }

        const productData = {
            ...form,
            price: Number(form.price),
            image: imageUrl
        }

        if (editingId) {
            await editProduct(editingId, productData)
            setEditingId(null)
        } else {
            await addProduct(productData)
        }

        setForm(initialForm)
        setSelectedFile(null)
        setPreviewImage("")
    }

    const handleEdit = (product) => {
        setEditingId(product._id)

        setForm({
            title: product.title,
            description: product.description,
            price: product.price,
            image: product.image
        })

        setPreviewImage(product.image)
        setSelectedFile(null)
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setForm(initialForm)
        setSelectedFile(null)
        setPreviewImage("")
    }

    return (
        <>
            <Helmet>
                <title>Administrar Producto</title>
                <meta name='description' content='Panel Privado para Administrar Productos' />
            </Helmet>

            <h1 className="mt-4">Administrar Productos</h1>
            <hr />
            {/* boton para importar los productos desde el archivo json */}
            {/* <button
                className="btn btn-secondary mb-3"
                onClick={migrateProductsFromJson}
            >
                Importar productos desde JSON
            </button> */}

            <form onSubmit={handleSubmit} className='row g-3 mb-4'>
                <div className="col-12 col-md-6">
                    <input
                        type='text'
                        name='title'
                        className='form-control'
                        placeholder='Nombre del Producto'
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-12 col-md-6">
                    <input
                        type='number'
                        name='price'
                        className='form-control'
                        placeholder='Precio del Producto'
                        value={form.price}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>

                <div className="col-12">
                    <input
                        type='text'
                        name='image'
                        className='form-control'
                        placeholder='Pegar URL de imagen'
                        value={form.image}
                        onChange={handleChange}
                    />
                    <small className="text-muted">
                        Puedes pegar una URL o cargar una imagen desde tu dispositivo.
                    </small>
                </div>

                <div className="col-12">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border rounded p-4 text-center ${dragActive ? "bg-light border-primary" : ""}`}
                        style={{ cursor: "pointer" }}
                    >
                        <FaUpload size={30} className="mb-2" />

                        <p className="mb-2">
                            Arrastra una imagen aquí o selecciónala desde tu dispositivo
                        </p>

                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            className="form-control"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {previewImage && (
                    <div className="col-12">
                        <p className="mb-2">Vista previa:</p>
                        <img
                            src={previewImage}
                            alt="Vista previa del producto"
                            className="img-thumbnail"
                            style={{
                                width: "180px",
                                height: "180px",
                                objectFit: "cover"
                            }}
                        />
                    </div>
                )}

                <div className="col-12">
                    <textarea
                        name='description'
                        className='form-control'
                        placeholder='Descripción del Producto'
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-12 d-flex gap-2">
                    <button
                        className='btn btn-primary'
                        type='submit'
                        disabled={uploadingImage}
                    >
                        <FaPlus /> {
                            uploadingImage
                                ? "Subiendo imagen..."
                                : editingId
                                    ? "Actualizar Producto"
                                    : "Agregar Producto"
                        }
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleCancelEdit}
                        >
                            Cancelar edición
                        </button>
                    )}
                </div>
            </form>

            {loadingProducts ? (
                <div className="text-center">
                    <div className="spinner-border" role='status'></div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            style={{
                                                width: "60px",
                                                height: "60px",
                                                objectFit: "cover",
                                                borderRadius: "8px"
                                            }}
                                        />
                                    </td>

                                    <td>{product.title}</td>
                                    <td>${product.price}</td>

                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => handleEdit(product)}
                                        >
                                            <FaEdit /> Editar
                                        </button>
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteProduct(product._id)}
                                        >
                                            <FaTrash /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}
