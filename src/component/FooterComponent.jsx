import React from 'react'
import '../styles/FooterComponent.css'

export const FooterComponent = () => {
    return (
        <footer>
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
