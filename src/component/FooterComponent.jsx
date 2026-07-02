import React, { useContext } from 'react'
import '../styles/FooterComponent.css'
import { PersonasContext } from '../context/PersonasContext'
import { CharacterComponent } from './CharacterComponent'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export const FooterComponent = () => {
    const { characters } = useContext(PersonasContext)

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">

                    <section className="footer-section">
                        <h3 className="footer-title">Custom Shopping</h3>
                        <p className="footer-text">
                            Tu tienda online para encontrar productos de calidad,
                            con una experiencia simple, rápida y segura.
                        </p>
                    </section>

                    <section className="footer-section">
                        <h4 className="footer-subtitle">Enlaces</h4>

                        <nav className="footer-nav">
                            <Link to="/" className="footer-link">Productos</Link>
                            <Link to="/carrito" className="footer-link">Carrito</Link>
                            <Link to="/login" className="footer-link">Login</Link>
                        </nav>
                    </section>
                </div>

                {characters?.length > 0 && (
                    <div className="footer-collaborators">
                        <h4 className="footer-subtitle">Colaboradores</h4>

                        <div className="footer-collaborators-grid">
                            {characters.map(character => (
                                <CharacterComponent
                                    key={character._id}
                                    image={character.image}
                                    name={character.name}
                                    description={character.description}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="footer-copy">
                    <p>© 2026 Custom Shopping. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}