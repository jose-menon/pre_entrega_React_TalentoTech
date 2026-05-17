import React, { useContext } from 'react'
import { PersonasContext } from '../context/PersonasContext'
import '../styles/CharacterComponent.css'

export const CharacterComponent = ({ id, name, image, description }) => {
    const { characters } = useContext(PersonasContext)
    return (
        <div className='character-card'>
            <img src={image} alt={name} className='character-img'/>
            <div className='character-content'>
                <h3 className='character-title'>{name}</h3>
                <p className='character-description'>{description}</p>
            </div>
        </div>
    )
}
