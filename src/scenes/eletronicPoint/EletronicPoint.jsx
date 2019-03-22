import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'
import * as emailjs from 'emailjs-com';

import './EletronicPoint.scss'

import Fingersprint from '../../images/Fingerprint.svg'
import { EmailLayout } from '../../components/email-layout/EmailLayout';

export class EletronicPoint extends Component {

    componentDidMount() {
        //this._sendEmail();
        this._getMarkPoint()
    }

    _getMarkPoint() {
        if (!window.indexedDB) {
            toast.error("Seu navegador não suporta IndexedDB");
        }
        else {
            /* Var's */
            let db;
            let objectStore;
            let request;
            let transaction;

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
                const timetable = document.getElementById('timetable');
                if (timetable.childNodes.length === 1) {
                    try {
                        db = event.target.result;
                        transaction = db.transaction(["Ponto"], 'readwrite');
                        objectStore = transaction.objectStore('Ponto');
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
                    catch (event) {
                        toast.error("Erro:" + event);
                    }
                };

            }
        }
    }

    _markPoint = () => {
        if (!window.indexedDB) {
            toast.error("Seu navegador não suporta IndexedDB");
        }
        else {
            /* Var's */
            let db;
            let objectStore;
            let request;
            let transaction;

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

                    //Test                    
                    var x = new Date();
                    x.setDate(1);
                    x.setMonth(x.getMonth() - 4);
                    objectStore.add(
                        x
                    );

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

        window.location.reload();
    }

    _sendEmail() {
        const date = new Date()
        const currentMonth = date.getMonth() + 1

        let controller = false;
        let dates = []

        if (window.indexedDB) {
            /* Var's */
            let db;
            let objectStore;
            let request;
            let transaction;

            request = window.indexedDB.open("Ponto", 1);
            request.onerror = function () {
                return;
            }

            request.onsuccess = function (event) {
                try {
                    db = event.target.result;
                    transaction = db.transaction(["Ponto"], 'readwrite');
                    objectStore = transaction.objectStore("Ponto");
                    request = objectStore.getAll("Ponto");

                    objectStore.openCursor().onsuccess = function (event) {
                        const cursor = event.target.result;

                        if (cursor && !controller) {
                            const date = moment(cursor.value).format('DD/MM/YYYY, H:mm:ss');
                            const month = date.slice(3, 5);

                            if (currentMonth <= 3) {
                                switch (month) {
                                    case '12':
                                    case '11':
                                    case '10':
                                        dates.push(date);
                                        cursor.delete();
                                        break;
                                    default:
                                        break;
                                }
                            }
                            else if ((currentMonth - month) <= 3) {
                                dates.push(date);
                                cursor.delete();
                            }
                            else {
                                controller = false;
                            }
                            cursor.continue();
                        }
                        else if (dates.length > 0) {
                            const month = dates[0].slice(3, 5);
                            var template_params = {
                                "reply_to": "to",
                                "from_name": "from",
                                "to_name": "Sujeito",
                                "message_html": <EmailLayout month={month} schedules={dates.toString()} />
                            }

                            var service_id = 'mailjet';
                            var template_id = 'template_id';
                            var user_id = 'user_id';
                            emailjs.send(service_id, template_id, template_params, user_id).then(response => {
                                toast.success('Email enviado com sucesso');
                            }).catch((error) => {
                                toast.error("Erro ao enviar email: " + error);
                            })
                        }
                    }
                }
                catch (event) {
                    return;
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
