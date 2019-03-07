import React, { Component } from 'react';
import { Button } from '../../components/button/Button';
import { InputNumber } from '../../components/input-number/InputNumber';

import './Ticket.scss';

export class Ticket extends Component {

    state = {
        currentMoney: 100,
        currentDiscountValue: 0
    }

    _getDaysOfMonth() {
        const date = new Date()
        const year = date.getFullYear()
        let leapYear = false

        if ((year % 4 === 0 && year % 400 === 0) ||
            (year % 4 === 0 && year % 100 !== 0)) {
            leapYear = true
        }

        const month = date.getMonth() + 1
        if (month === 2) {
            if (leapYear) {
                return 29
            }
            else {
                return 28
            }
        }
        else if (month === 1 || month === 3 || month === 5 || month === 7 ||
            month === 8 || month === 10 || month === 12) {
            return 31
        }
        else {
            return 30
        }
    }

    _getWeeDays() {
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth()

        let days = 0;
        for (let day = date.getDate(); day <= this._getDaysOfMonth(); day++) {

            const dayOfWeek = (new Date(year, month, day)).getDay()
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                days += 1
            }
        }

        return days;
    }

    _handleDiscountMoney = () => {
        const { currentMoney, currentDiscountValue } = this.state //#endregion

        this.setState(() => ({
            currentMoney: currentMoney - currentDiscountValue,
        }))
    }

    _handleDiscountValue = (value) => {
        this.setState(() => ({
            currentDiscountValue: value,
        }))
    }

    render() {
        const { currentMoney } = this.state

        return (
            <div className="ticket">
                <div className="card">
                    <div>
                        <p>Valor Total:</p>
                        <h2>R$</h2>
                        <h1>{currentMoney}</h1>
                    </div>

                    <div>
                        <p>Media Diária:</p>
                        <h3>R$</h3>
                        <h4>{(this.state.currentMoney / this._getWeeDays()).toFixed(2)}</h4>
                    </div>
                </div>

                <div className="discount">
                    <h2>Descontar valor:</h2>
                    <InputNumber getValue={this._handleDiscountValue} />
                    <Button text="Confirmar" onClick={this._handleDiscountMoney} />
                </div>
            </div>
        );
    }
}
