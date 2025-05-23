import modal from "./modal.js";
import statusAvaliacao from "./statusAvaliacao.js";
import modalIframe from "./modalIframe.js";
import eventsModalMain from "./openModalEvents.js";

//Eventos Modal
eventsModalMain();

//Modal
modal.modalMain();

//Avaliação
if (statusAvaliacao.statusAvaliacaoP) {
  await statusAvaliacao.exibeStatusAvaliacao();
}

//Iframe
modalIframe.iframeMain();

//PDF
const openNotasModal = document.querySelectorAll(".vizualizar_notas");
const closeNotasModal = document.getElementById("close_modalNotas");
const exportButton = document.querySelector(".export_button");
let nomeEquipe = "";

function addNotasModalEvent() {
  const modalNotas = document.getElementById("modalNotas");
  if (openNotasModal) {
    openNotasModal.forEach((btn) => {
      btn.addEventListener("click", async () => {
        nomeEquipe = btn.getAttribute("data-equipe");
        const PDFPath = await getPDFPath(nomeEquipe);

        if (PDFPath) {
          modalIframe.setURLIframe(PDFPath);
          modalNotas.classList.add("visible");
          export_excel_event();
        } else {
          alert("Avaliação ainda não foi feita");
        }
      });
    });
  }

  if (closeNotasModal) {
    closeNotasModal.addEventListener("click", () =>
      modalNotas.classList.remove("visible")
    );
  }
}

async function export_excel_event() {
  if (exportButton) {
    let ExcelURL = await getExcelPath(nomeEquipe);

    if (ExcelURL.startsWith(".")) {
      ExcelURL = ExcelURL.replace(".", "");
    }

    exportButton.setAttribute("href", ExcelURL);
  }
}

async function getExcelPath(nomeEquipe) {
  try {
    const response = await fetch(
      `/gerarExcel?nomeEquipe=${encodeURIComponent(nomeEquipe)}`
    );

    if (!response.ok) {
      throw new Error("Equipe não encontrada");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Erro ao buscar url Excel:", error);
    return null;
  }
}

async function getPDFPath(nomeEquipe) {
  try {
    const response = await fetch(
      `/gerarPDF?nomeEquipe=${encodeURIComponent(nomeEquipe)}`
    );

    if (!response.ok) {
      throw new error("Equipe não encontrada");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Erro ao buscar status da avaliação:", error);
    return null;
  }
}

addNotasModalEvent();

//Funções
const adm_password = "admin";

function redirecionar(url) {
  window.location.href = url;
}

function verificaSenha(url) {
  let input_senha = document.querySelector("#inp_senha");
  if (input_senha.value == adm_password) {
    input_senha.value = "";
    redirecionar(url);
  } else {
    alert("Senha Incorreta");
  }
}

export default {
  verificaSenha,
  redirecionar,
};
