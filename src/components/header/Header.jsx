import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import './Hearder.scss';

export class Header extends Component {

    _openMenu = () => {
        let menu = document.getElementsByClassName("menu");
        if (menu[0].className === "menu") {
            menu[0].className += " menu-responsive";
        } else {
            menu[0].className = "menu";
        }
    }

    render() {
        return (
            <header>
                <ul className="menu">
                    <li className="sub-menu li-icon" onClick={this._openMenu}><Link to="#"><FontAwesomeIcon icon={faBars} className="icon" /></Link></li>
                    <li className="sub-menu"><Link to="/">Ponto</Link></li>
                    <li className="sub-menu"><Link to="/ticket">Ticket</Link></li>
                </ul>
            </header >
        );
    }
}
