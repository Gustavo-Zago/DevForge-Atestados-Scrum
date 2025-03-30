//Geral
main = document.querySelector("main");
header = document.querySelector("header");
modal = document.getElementById("modal");
closeButton = document.getElementById("close_modal");

//Index
atestadoButton = document.getElementById("btn_atestado");
gestaoButton = document.getElementById("btn_gestao");
equipeButton = document.getElementById("btn_equipe");
admButton = document.getElementById("btn_adm");
enviarButton = document.getElementById("btn_enviar");
adm_btn_senha = document.querySelector("#adm_btn_senha");

//Espera
buscarButton = document.getElementById("btn_buscar");

const adm_password = "admin";

//Geral

if (closeButton) {
  closeButton.addEventListener("click", () => {
    modalAction("close");
    listaInputs = document.querySelectorAll("dialog input");
    listaInputs.forEach((input) => {
      input.value = "";
    });
  });
}

//Index
// Verifica se o botão "atestadoButton" existe no DOM
if (atestadoButton) {
  atestadoButton.addEventListener("click", function () {
    redirecionar("/espera");
  });
}

if (equipeButton) {
  equipeButton.addEventListener("click", function () {
    redirecionar("/scrum");
  });
}

if (gestaoButton) {
  gestaoButton.addEventListener("click", function () {
    modalAction("open");

    adm_btn_senha.addEventListener("click", function (e) {
      e.preventDefault();
      verificaSenha("/gestaoat");
    });
  });
}

if (admButton) {
  admButton.addEventListener("click", function () {
    modalAction("open");

    adm_btn_senha.addEventListener("click", function (e) {
      e.preventDefault();
      verificaSenha("/adminscrum");
    });
  });
}

//Histórico Atestado

if (buscarButton) {
  buscarButton.addEventListener("click", function () {
    modalAction("open");
  });
}

function redirecionar(url) {
  window.location.href = url;
}

function modalAction(action) {
  modal.style.display = action == "open" ? "flex" : "none";
  if (main) {
    main.classList.toggle("blur");
    main.classList.toggle("noClick");
  }

  if (header) {
    header.classList.toggle("blur");
    header.classList.toggle("noClick");
  }

  listaBotao = document.querySelectorAll(".botao");
  listaBotao.forEach((botao) => {
    botao.classList.toggle("noClick");
  });
}

function verificaSenha(url) {
  let input_senha = document.querySelector("#inp_senha").value;
  if (input_senha == adm_password) {
    input_senha.value = "";
    redirecionar(url);
    return;
  }
}
function ModalAtestado(url) {
  console.log(url);
}


// Função para abrir o PDF no iframe dentro do modal
function openModal(url) {
    document.getElementById('iframe-pdf').src = url;
    document.getElementById('modal').style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('iframe-pdf').src = ""; // Limpar o iframe
}
