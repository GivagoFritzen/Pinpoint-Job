import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

export class Button extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        text: PropTypes.string.isRequired,
    }

    render() {
        const { onClick, text } = this.props

        return (
            <button className="cc-button" onClick={() => onClick()}>{text}</button>
        );
    }
}
