import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'
import * as emailjs from 'emailjs-com';

import './EletronicPoint.scss'

import Fingersprint from '../../images/Fingerprint.svg'
import { EmailLayout } from '../../components/email-layout/EmailLayout';

export class EletronicPoint extends Component {

    state = {
        dates: []
    }

    componentDidMount() {
        this._getMarkPoint(this).then(response => {
            this.setState(() => ({ dates: response }))
        }).catch(function (error) {
            toast.error(error.message);
        });
        this._sendEmail();
    }

    _getMarkPoint() {
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

                    request = window.indexedDB.open("Ponto", 1);
                    request.onerror = function () {
                        reject(Error("Erro ao abrir o banco de dados "));
                    }

                    request.onupgradeneeded = function (event) {
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
                                objectStore.openCursor().onsuccess = function (event) {
                                    const cursor = event.target.result;
                                    if (cursor) {
                                        dates.push(cursor.value);
                                        cursor.continue();
                                    }
                                    else {
                                        resolve(dates)
                                    }
                                }
                            }
                            catch (event) {
                                reject(Error("Erro:" + event));
                            }
                        };

                    }
                }
            })
    }

    _markPoint = () => {
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

                    request = window.indexedDB.open("Ponto", 1);
                    request.onerror = function () {
                        reject(Error("Erro ao abrir o banco de dados "));
                    }

                    request.onupgradeneeded = function (event) {
                        db = event.target.result;
                        objectStore = db.createObjectStore("Ponto", { keyPath: "id", autoIncrement: true });
                        db.close();
                    };

                    request.onsuccess = function (event) {
                        try {
                            db = event.target.result;
                            transaction = db.transaction(["Ponto"], 'readwrite');
                            objectStore = transaction.objectStore("Ponto", { keyPath: "id", autoIncrement: true });

                            const newDate = new Date()
                            objectStore.add(
                                newDate
                            );
                            db.close();

                            resolve(newDate);
                        }
                        catch (event) {
                            reject(Error(("Erro:" + event)));
                        }
                    }
                }
            })
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
                                "message_html": EmailLayout.emailForm(month, dates.toString())
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
                <button onClick={() =>
                    this._markPoint(this).then(response => {
                        const date = this.state.dates
                        date.push(response)
                        this.setState(() => ({ dates: date }))
                    }).catch(function (error) {
                        toast.error(error.message);
                    })}>
                    <img src={Fingersprint} className="finger-sprint" alt="Finger Sprint" />
                </button>

                <h2>Tabela</h2>
                {this.renderTimeTable()}
            </div >
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
                    {this.renderTimeTableTds()}
                </tbody>
            </table>
        );
    }

    renderTimeTableTds() {
        const { dates } = this.state
        let lastDate = ''
        let matrix = [], i, k;
        for (i = 0, k = -1; i < dates.length; i++) {
            const date = moment(dates[i]).format('DD/M/YYYY, H:mm:ss');

            if (lastDate === '' || date.substring(0, 2) !== lastDate.substring(0, 2)) {
                lastDate = date;
                k++;
                matrix[k] = [];
            }

            matrix[k].push(date);
        }

        return matrix.map((row, key) => {
            return <tr key={key}>
                {row.map((day, key) => {
                    return (
                        <td key={key}>{day}</td>
                    )
                })}
            </tr>
        })
    }
}
