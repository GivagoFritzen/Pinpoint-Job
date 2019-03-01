/* Var's */
var db;
var objectStore;
var request;
var transaction;


window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
if (!window.indexedDB) {
    console.log("Seu navegador não suporta IndexedDB");
}
else {
    /* 
     * Acessando Banco - nome do banco de dados e a versão da base de dados
     * @parameter('Name', version)
     */
    request = window.indexedDB.open("Estudantes");

    request.onerror = function (event) {
        console.log("Erro ao abrir o banco de dados", event);
    }

    /* 
     * O evento onupgradeneeded será chamado sempre que a página for acessada pela primeira vez 
     * no navegador do usuário ou se houver uma atualização na versão do banco de dados.
     */
    request.onupgradeneeded = function (event) {
        console.log("Atualizando...");
        db = event.target.result;
        objectStore = db.createObjectStore("Estudantes", { keyPath: "Codigo" });
    };

    request.onsuccess = function (event) {
        console.log("Banco de dados aberto com sucesso.");
        db = event.target.result;
    }


    /*
     * Adicionar dados ao banco de dados
     */

    // Variaveis para teste
    const nome = 'novo nome';
    const genero = 'f';
    const dataNascimento = '01/10/1994';
    const foto = 'www.google.com.br';
    const idTurma = 1;
    const idAluno = 5;


    transaction = db.transaction(["Alunos"], "readwrite");
    // Tentar abrir conexao para se conectar
    transaction.oncomplete = function () {
        console.log("Sucesso");

        objectStore = transaction.objectStore("Alunos");
        objectStore.add({
            nome: nome, genero: genero, dataNascimento: dataNascimento,
            foto: foto, idTurma: idTurma
        });

        //  Add no DB
        request = objectStore.get(idTurma);
        request.onsuccess = function () {
            console.log(nome + ' cadastrado com sucesso')
        };
    };
    transaction.onerror = function () {
        console.log("Error");
    };



    /* Removendo dados */
    transaction = db.transaction(["AlunosRemovidos"], "readwrite");
    transaction.oncomplete = function () {
        console.log("Sucesso");
        transaction.objectStore("Alunos").delete(idAluno);
    };
    transaction.onerror = function () {
        console.log("Error");
    };



    /* Acessar objeto pela sua chave */
    // transaction = db.transaction(["Estudantes"], "readwrite");
    // objectStore = transaction.objectStore("Estudantes");
    // request = objectStore.get(codigo);
    // request.onsuccess = function () {
    //     console.log("Nome : " + request.result.nome);
    // };



    /* Atualizar dados */
    // transaction = db.transaction(["Estudantes"], "readwrite");
    // objectStore = transaction.objectStore("Estudantes");
    // request = objectStore.get(codigo);
    // request.onsuccess = function () {
    //     console.log("Atualizado : " + request.result.name + " para " + nome);
    //     request.result.nome = nome;
    //     objectStore.put(request.result);
    // };

}
