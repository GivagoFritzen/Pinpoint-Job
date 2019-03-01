import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Hearder.scss';

export class Header extends Component {
    render() {
        return (
            <header>
                <ul>
                    <li><Link to="/">Ponto</Link></li>
                    <li><Link to="/ticket">Ticket</Link></li>
                </ul>
            </header>
        );
    }
}
