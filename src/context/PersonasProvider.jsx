import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { PersonasContext } from './PersonasContext'

export const PersonasProvider = ({ children }) => {
    const [characters, setcharacters] = useState([])

    const fetchCharacters = async () => {
        try {
            const response = await fetch('/public/personas.json')
            const data = await response.json()
            setcharacters(data.data)
        } catch (error) {
            Swal.fire(
                {
                    icon: 'error',
                    title: '¡Error!',
                    text: 'Ocurrio un error al cargar las personas'
                }
            )
            console.error(error)
        }
    }
    useEffect(() => {
        fetchCharacters()
        return () => {
        }
    }, [])

    return (
        <PersonasContext.Provider value={{characters}}>
            {children}
        </PersonasContext.Provider>
    )
}
