import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './InputNumber.scss';

export class InputNumber extends Component {
    static propTypes = {
        getValue: PropTypes.func,
    }

    state = {
        value: 0
    }

    _handleValue(event) {
        const { getValue } = this.props

        let number = event.target.value
        if (number === '') {
            return
        }
        if (number < 0) {
            number = Math.abs(number)
        }

        this.setState(() => ({ value: number }),
            getValue(number))
    }

    render() {
        const { value } = this.state

        return (
            <input className="cc-input-number" type="number" min={0} value={value}
                pattern='[0-9]{0,5}' onChange={(event) => this._handleValue(event)} />
        );
    }
}
