import index from "./index.js";
import modal from "./modal.js";

const atestadoButton = document.getElementById("btn_atestado");
const gestaoButton = document.getElementById("btn_gestao");
const equipeButton = document.getElementById("btn_equipe");
const admButton = document.getElementById("btn_adm");
const enviarButton = document.getElementById("btn_enviar");
const adm_btn_senha = document.querySelector("#adm_btn_senha");
const buscarButton = document.getElementById("btn_buscar");

function addAtestadoEvent() {
  if (atestadoButton) {
    atestadoButton.addEventListener("click", function () {
      index.redirecionar("/espera");
    });
  }
}

function addEnviarEvent() {
  if (enviarButton) {
    enviarButton.addEventListener("click", function () {
      index.redirecionar("/formAtestado");
    });
  }
}

function addEquipeEvent() {
  if (equipeButton) {
    equipeButton.addEventListener("click", function () {
      index.redirecionar("/scrum");
    });
  }
}

function addGestaoEvent() {
  if (gestaoButton) {
    gestaoButton.addEventListener("click", function () {
      modal.modalAction("open");

      adm_btn_senha.addEventListener("click", function () {
        index.verificaSenha("/gestaoat");
      });
    });
  }
}

function addAdmEvent() {
  if (admButton) {
    admButton.addEventListener("click", function () {
      modal.modalAction("open");

      adm_btn_senha.addEventListener("click", function () {
        index.verificaSenha("/adminscrum");
      });
    });
  }
}

function addBuscarEvent() {
  if (buscarButton) {
    buscarButton.addEventListener("click", function () {
      modal.modalAction("open");
    });
  }
}

function selecaoMain() {
  addAtestadoEvent();
  addEnviarEvent();
  addEquipeEvent();
  addGestaoEvent();
  addAdmEvent();
  addBuscarEvent();
}

export default selecaoMain;
