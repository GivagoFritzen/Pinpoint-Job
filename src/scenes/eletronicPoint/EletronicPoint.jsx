import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'
import * as emailjs from 'emailjs-com';

import './EletronicPoint.scss'

import Fingersprint from '../../images/Fingerprint.svg'

export class EletronicPoint extends Component {

    componentDidMount() {
        this._sendEmail();
    }

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
                            const date = moment(cursor.value).format('DD/M/YYYY, H:mm:ss');

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

    _sendEmail() {
        var template_params = {
            "reply_to": "to",
            "from_name": "from",
            "to_name": "Sujeito",
            "message_html": "Uma mensagem"
        }

        var service_id = "";
        var template_id = "";
        var user_id = '';
        emailjs.send(service_id, template_id, template_params, user_id).then(response => {
            toast.success('Email enviado com sucesso');
        }).catch((error) => {
            toast.error("Erro ao enviar email: " + error);
        })
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
