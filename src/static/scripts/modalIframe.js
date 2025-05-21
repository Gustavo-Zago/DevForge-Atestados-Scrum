const modalIframe = document.getElementById("modalIframe");
const iframe = document.getElementById("iframe-pdf");
const listaBtnArquivo = document.querySelectorAll(".visualizar-button");
const btnClose = document.getElementById("closeIframe");
const listaBtnStatus = document.querySelectorAll(".status-button");
let pdfPath = "";

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

function openIframe(url) {
  pdfPath = fixURL(url);

  if (!url.startsWith("/")) {
    pdfPath = "/" + pdfPath;
  }

  iframe.src = pdfPath;
  modalIframe.style.display = "flex";
}

function closeIframe() {
  iframe.src = "";
  modalIframe.style.display = "none";
  document.body.classList.remove("no-scroll");
}

function fixURL(url) {
  url = url.split("/");
  url.splice(0, 1);
  url = url.join("/");
  return url;
}

function iframeMain() {
  addGetURL();
  addAlterStatus();
  addCloseIframe();
}

export default iframeMain;
