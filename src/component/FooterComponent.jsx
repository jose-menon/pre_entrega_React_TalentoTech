import React, { useContext } from 'react'
import '../styles/FooterComponent.css'
import { PersonasContext } from '../context/PersonasContext'
import { Key } from '@mui/icons-material'
import { CharacterComponent } from './CharacterComponent'

export const FooterComponent = () => {
    const {characters} = useContext(PersonasContext)
    return (
        <footer>
            <hr />
            <div>
                <h1>Colaboradores: </h1>
                <hr />
                {
                    characters.map(character =>(
                        <CharacterComponent
                        key={character._id}
                        image={character.image}
                        name={character.name}
                        description={character.description}
                        />
                    ))
                }
            </div>
            <hr />
            <nav className='navbar'>
                <div>
                    <a href="#" className='footer-link'>Acerca de Nosotros</a>
                    <a href="#" className='footer-link'>Políticas de Privacidad</a>
                </div>
            </nav>
            <hr />
            <div className="text-copy">
                <p>
                    © 2026 - Todos los Derechos Reservados - Custom Shopping
                </p>
            </div>
        </footer>
    )
}
