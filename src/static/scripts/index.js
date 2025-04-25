//Geral
const main = document.querySelector("main");
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

if (enviarButton) {
  enviarButton.addEventListener("click", function () {
    redirecionar("/formAtestado");
    console.log("teste");
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

listaBtnArquivo = document.querySelectorAll(".visualizar-button");
listaBtnStatus = document.querySelectorAll(".status-button");
urlArquivo = "";
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
  url = url.split("/");
  nomeArquivo = url[url.length - 1];
  url.splice(0, 1);
  url = url.join("/");
  urlArquivo = nomeArquivo;
  document.getElementById("iframe-pdf").src = url;
  document.getElementById("modal").style.display = "block";
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
document.getElementById("modal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

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

// Seleciona o input
const input = document.getElementById('inputNIn');

// Adiciona o evento de alteração no valor do input
input.addEventListener('input', function() {
    alert('O valor do input foi alterado!');
}); 
