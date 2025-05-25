import modal from "./modal.js";

const modalIframe = document.getElementById("modalIframe");
const iframe = document.getElementById("iframe-pdf");
const listaBtnArquivo = document.querySelectorAll(".visualizar-button");
const btnClose = document.getElementById("closeIframe");
const listaBtnStatus = document.querySelectorAll(".status-button");
let pdfPath = "";

//Excel
const openNotasModal = document.querySelectorAll(".vizualizar_notas");
const closeNotasModal = document.getElementById("close_modalNotas");
const exportButton = document.querySelector(".export_button");
let nomeEquipe = "";

function addGetURL() {
  if (listaBtnArquivo) {
    listaBtnArquivo.forEach((botao) => {
      botao.addEventListener("click", () => {
        pdfPath = botao.getAttribute("id");
        openIframe(pdfPath);
      });
    });
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

async function addExportExcelEvent() {
  if (exportButton) {
    let ExcelURL = await getExcelPath(nomeEquipe);

    if (ExcelURL.startsWith(".")) {
      ExcelURL = ExcelURL.replace(".", "");
    }

    exportButton.setAttribute("href", ExcelURL);
  }
}

function addAlterStatus() {
  if (listaBtnStatus) {
    listaBtnStatus.forEach((botao) => {
      botao.addEventListener("click", () => {
        const statusLinha = botao.getAttribute("id");
        fetch(
          `/alterarStatus?URL=${encodeURIComponent(
            pdfPath
          )}&status=${encodeURIComponent(statusLinha)}`
        )
          .then((response) => {
            if (response.status == 200) {
              closeIframe();
              window.location.reload();
            }
          })
          .catch((error) => console.error("Erro: ", error));
      });
    });
  }
}

function addCloseIframe() {
  if (btnClose) {
    btnClose.addEventListener("click", function (e) {
      closeIframe();
    });
  }
}

function setURLIframe(url) {
  pdfPath = fixURL(url);

  if (!url.startsWith("/")) {
    pdfPath = "/" + pdfPath;
  }

  if (url.startsWith(".")) {
    pdfPath = url.replace(".", "");
  }

  iframe.src = pdfPath;
}

function openIframe(url) {
  setURLIframe(url);
  modal.modalAction("open");
}

function closeIframe() {
  iframe.src = "";
  modal.modalAction("close");
}

function fixURL(url) {
  url = url.split("/");
  url.splice(0, 1);
  url = url.join("/");
  return url;
}

function addNotasModalEvent() {
  const modalNotas = document.getElementById("modalNotas");
  if (openNotasModal) {
    openNotasModal.forEach((btn) => {
      btn.addEventListener("click", async () => {
        nomeEquipe = btn.getAttribute("data-equipe");
        const PDFPath = await getPDFPath(nomeEquipe);

        if (PDFPath) {
          setURLIframe(PDFPath);
          modalNotas.classList.add("visible");
          addExportExcelEvent();
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

function iframeMain() {
  addGetURL();
  addAlterStatus();
  addCloseIframe();
}

export default {
  setURLIframe,
  addNotasModalEvent,
  iframeMain,
};
