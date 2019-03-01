import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'

import './EletronicPoint.scss'

import Fingersprint from '../../images/Fingerprint.svg'

export class EletronicPoint extends Component {

    _getMarkPoint() {
        if (!window.indexedDB) {
            toast.error("Seu navegador não suporta IndexedDB");
        }
        else {
            /* Var's */
            var db;
            var objectStore;
            var request;
            var transaction;

            request = window.indexedDB.open("Ponto", 1);
            request.onsuccess = function (event) {
                const timetable = document.getElementById('timetable');
                if (timetable.childNodes.length === 1) {

                    db = event.target.result;
                    transaction = db.transaction(["Ponto"], "readwrite");
                    objectStore = transaction.objectStore("Ponto");
                    request = objectStore.getAll("Ponto");

                    let dates = []
                    let lastDate = ''
                    let timeTableTR

                    objectStore.openCursor().onsuccess = function (event) {
                        const cursor = event.target.result;
                        if (cursor) {
                            const date = moment(cursor.value).format('DD MMMM YYYY, h:mm:ss a');

                            if (lastDate === '' || date.substring(0, 2) !== lastDate.substring(0, 2)) {
                                timeTableTR = document.createElement('tr');
                                timetable.appendChild(timeTableTR);
                                lastDate = date;
                            }

                            dates.push(cursor.value);

                            let timeTableTD = document.createElement('td');
                            timeTableTD.innerHTML += date
                            timeTableTR.appendChild(timeTableTD);

                            cursor.continue();

                            timetable.appendChild(timeTableTR);
                        }
                    }
                }
            };
        }
    }

    _markPoint = () => {
        if (!window.indexedDB) {
            toast.error("Seu navegador não suporta IndexedDB");
        }
        else {
            /* Var's */
            var db;
            var objectStore;
            var request;
            var transaction;

            request = window.indexedDB.open("Ponto", 1);
            request.onerror = function () {
                toast.error("Erro ao abrir o banco de dados ");
            }

            request.onupgradeneeded = function (event) {
                toast.success("Atualizando...");
                db = event.target.result;
                objectStore = db.createObjectStore("Ponto", { keyPath: "id", autoIncrement: true });
                db.close();
            };

            request.onsuccess = function (event) {
                try {
                    db = event.target.result;
                    transaction = db.transaction(["Ponto"], 'readwrite');
                    objectStore = transaction.objectStore("Ponto", { keyPath: "id", autoIncrement: true });
                    objectStore.add(
                        new Date()
                    );
                    objectStore.onsuccess = function () {
                        toast.success('Ponto Atualizado!!!');
                    }
                    db.close();
                }
                catch (event) {
                    toast.error("Erro:" + event);
                }
            }
        }
    }

    render() {
        return (
            <div>
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
                <h1>Ponto</h1>
                <button onClick={this._markPoint}>
                    <img src={Fingersprint} className="finger-sprint" alt="Finger Sprint" />
                </button>

                <h2>Tabela</h2>
                {this.renderTimeTable()}
            </div>
        );
    }

    renderTimeTable() {
        this._getMarkPoint()
        return (
            <table>
                <tbody id='timetable'>
                    <tr>
                        <th>Entrada 1° Turno</th>
                        <th>Saida 1° Turno</th>
                        <th>Entrada 2° Turno</th>
                        <th>Saida 2° Turno</th>
                        <th>Entrada 3° Turno</th>
                        <th>Saida 3° Turno</th>
                        <th>Entrada 4° Turno</th>
                        <th>Saida 4° Turno</th>
                    </tr>
                </tbody>
            </table>
        );
    }
}
