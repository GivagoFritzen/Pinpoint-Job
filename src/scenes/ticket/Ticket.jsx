import React, { Component } from 'react';
import { Button } from '../../components/button/Button';
import { InputNumber } from '../../components/input-number/InputNumber';

import { ToastContainer, toast } from 'react-toastify';

import './Ticket.scss';

export class Ticket extends Component {

    state = {
        currentMoney: 0,
        currentAddValue: 0,
        currentDiscountValue: 0,
    }

    componentDidMount() {
        this._getValue();
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

    _getValue() {
        this._getValueDB(this).then(response => {
            this.setState(() => ({ currentMoney: response }))
        }).catch(function (error) {
            toast.error(error.message);
        });
    }

    _getValueDB() {
        return new Promise(
            function (resolve, reject) {
                if (!window.indexedDB) {
                    reject(Error("Seu navegador não suporta IndexedDB"));
                }
                else {
                    /* Var's */
                    let db;
                    let objectStore;
                    let request;
                    let transaction;

                    let getCurrentMoney = 0

                    request = window.indexedDB.open("Dinheiro", 1);
                    request.onerror = function () {
                        reject(Error("Erro ao abrir o banco de dados "));
                    }

                    request.onupgradeneeded = function (event) {
                        db = event.target.result;
                        objectStore = db.createObjectStore("Dinheiro", { keyPath: "id", autoIncrement: true });
                        db.close();
                    };

                    request.onsuccess = function (event) {
                        try {
                            db = event.target.result;
                            transaction = db.transaction(["Dinheiro"], 'readwrite');
                            objectStore = transaction.objectStore('Dinheiro');
                            request = objectStore.getAll("Dinheiro");

                            objectStore.openCursor().onsuccess = function (event) {
                                const cursor = event.target.result;
                                if (cursor) {
                                    getCurrentMoney = cursor.value.Value
                                    cursor.continue();
                                }
                                else {
                                    resolve(getCurrentMoney)
                                }
                            }
                        }
                        catch (event) {
                            reject(Error("Erro: " + event));
                        }
                    }
                }
            }
        )
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

    _handleAddMoney = () => {
        const { currentMoney, currentAddValue } = this.state
        this.setState(({
            currentMoney: (parseFloat(currentMoney) + parseFloat(currentAddValue)),
        }), this._saveValue())
    }

    _handleAddValue = (value) => {
        this.setState(() => ({
            currentAddValue: value,
        }))
    }

    _handleDiscountMoney = () => {
        const { currentMoney, currentDiscountValue } = this.state

        this.setState(({
            currentMoney: parseFloat(currentMoney) - parseFloat(currentDiscountValue),
        }), this._saveValue())
    }

    _handleDiscountValue = (value) => {
        this.setState(() => ({
            currentDiscountValue: value,
        }))
    }

    _saveValue() {
        if (!window.indexedDB) {
            toast.error("Seu navegador não suporta IndexedDB");
        }
        else {
            const { currentMoney } = this.state

            /* Var's */
            let db;
            let objectStore;
            let request;
            let transaction;

            request = window.indexedDB.open("Dinheiro", 1);
            request.onerror = function () {
                toast.error("Erro ao abrir o banco de dados ");
            }

            request.onupgradeneeded = function (event) {
                toast.success("Atualizando...");
                db = event.target.result;
                objectStore = db.createObjectStore("Dinheiro", { keyPath: "id", autoIncrement: true });
                db.close();
            };

            request.onsuccess = function (event) {
                try {
                    db = event.target.result;
                    transaction = db.transaction(["Dinheiro"], 'readwrite');
                    objectStore = transaction.objectStore("Dinheiro", { keyPath: "id", autoIncrement: true });
                    objectStore.put(
                        { Value: currentMoney }
                    );
                    objectStore.onsuccess = function () {
                        toast.success('Dinheiro Atualizado!');
                    }
                    db.close();
                }
                catch (event) {
                    toast.error("Erro: " + event);
                }
            }
        }
    }

    render() {
        const { currentMoney } = this.state

        return (
            <React.Fragment>
                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable

                    pauseOnHover
                />

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

                    <div className="add">
                        <h2>Adicionar valor:</h2>
                        <InputNumber getValue={this._handleAddValue} />
                        <Button text="Confirmar" onClick={this._handleAddMoney} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
