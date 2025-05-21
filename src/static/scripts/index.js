//Geral
import modal from "./modal.js";
const header = document.querySelector("header");
const modal = document.getElementById("modal");
const closeButton = document.getElementById("close_modal");

//Index
const atestadoButton = document.getElementById("btn_atestado");
const gestaoButton = document.getElementById("btn_gestao");
const equipeButton = document.getElementById("btn_equipe");
const admButton = document.getElementById("btn_adm");
const enviarButton = document.getElementById("btn_enviar");
const adm_btn_senha = document.querySelector("#adm_btn_senha");

//Espera
const buscarButton = document.getElementById("btn_buscar");

const adm_password = "admin";

//cadastroEquipes-modal
const btn_equipe_modal = document.getElementById("btn_equipe_modal");
const meuModal = document.getElementById("meuModal");
const closeButtonequipe = document.querySelector(".close_button"); // Seleciona o botão de fechar

if (btn_equipe_modal) {
    btn_equipe_modal.addEventListener("click", () => {
        meuModal.showModal();
    });
}

// Função para fechar o modal de cadastro de equipe
function closeCadastroModal() {
  meuModal.close(); // Fecha o modal
}

// Associa o evento de click no botão de fechar
if (closeButton) {
  closeButtonequipe.addEventListener("click", closeCadastroModal);
}

//Geral

//Index
// Verifica se o botão "atestadoButton" existe no DOM
if (atestadoButton) {
  atestadoButton.addEventListener("click", function () {
    redirecionar("/espera");
  });
}

if (enviarButton) {
  enviarButton.addEventListener("click", function () {
    redirecionar("/formAtestado");
  });
}

if (equipeButton) {
  equipeButton.addEventListener("click", function () {
    redirecionar("/scrum");
  });
}

if (gestaoButton) {
  gestaoButton.addEventListener("click", function () {
    modal.modalAction("open");

    adm_btn_senha.addEventListener("click", function () {
      verificaSenha("/gestaoat");
    });
  });
}

if (admButton) {
  admButton.addEventListener("click", function () {
    modal.modalAction("open");

    adm_btn_senha.addEventListener("click", function () {
      verificaSenha("/adminscrum");
    });
  });
}

if (modal.closeButton) {
  modal.closeModal();
}

//Histórico Atestado

if (buscarButton) {
  buscarButton.addEventListener("click", function () {
    modal.modalAction("open");
  });
}

function redirecionar(url) {
  window.location.href = url;
}

function verificaSenha(url) {
  let input_senha = document.querySelector("#inp_senha");
  if (input_senha.value == adm_password) {
    input_senha.value = "";
    redirecionar(url);
  }
}

const listaBtnArquivo = document.querySelectorAll(".visualizar-button");
const listaBtnStatus = document.querySelectorAll(".status-button");
let urlArquivo = "";

if (listaBtnArquivo) {
  listaBtnArquivo.forEach((botao) => {
    botao.addEventListener("click", () => {
      url = botao.getAttribute("id");
      openModal(url);
    });
  });
}

if (listaBtnStatus) {
  listaBtnStatus.forEach((botao) => {
    botao.addEventListener("click", () => {
      statusLinha = botao.getAttribute("id");
      fetch(
        `/alterarStatus?URL=${encodeURIComponent(
          urlArquivo
        )}&status=${encodeURIComponent(statusLinha)}`
      )
        .then((response) => {
          if (response.status == 200) {
            closeModal();
            window.location.reload();
          }
        })
        .catch((error) => console.error("Erro: ", error));
    });
  });
}

// Função para abrir o PDF no iframe dentro do modal
function openModal(url) {
  console.log("URL recebida:", url); // para depurar no console

  if (!url.startsWith("/")) {
    url = "/" + url;
  }

  urlArquivo = url; // guarda para o botão Aprovar/Reprovar
  const iframe = document.getElementById("iframe-pdf");
  iframe.src = url;
  document.getElementById("modal").style.display = "flex";
}



// Função para fechar o modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("iframe-pdf").src = ""; // Limpar o iframe
}

// Função para fechar o modal
function closeModal() {
  const modal = document.getElementById("modal");
  const iframe = document.getElementById("iframe-pdf");

  iframe.src = "";
  modal.style.display = "none";
  document.body.classList.remove("no-scroll");
}

// Fechar modal ao clicar fora do conteúdo
if (document.getElementById("modal")) {
  document.getElementById("modal").addEventListener("click", function (e) {
    if (e.target === this) {
      closeModal();
    }
  });
}
// Atualize os listeners dos botões de visualização
document.querySelectorAll(".visualizar-button").forEach((button) => {
  button.addEventListener("click", function () {
    const pdfPath = this.getAttribute("id");
    openModal(pdfPath);
  });
});

function gerarCampos() {
  const numero = document.getElementById("num_integrantes").value;
  const container = document.getElementById("campos_integrantes");
  container.innerHTML = "";

  for (let i = 0; i < numero; i++) {
    container.innerHTML += `
    <label>Nome do Integrante ${i + 1}:</label><br>
    <input type="text" name="nome_${i}" required><br>
    <label>Função do Integrante ${i + 1}:</label><br>
    <input type="text" name="funcao_${i}" required><br><br>
                `;
  }
}
