import meuModal from "./cadastroEquipe-modal.js";
import modal from "./modal.js";
import statusAvaliacao from "./statusAvaliacao.js";
import modalIframe from "./modalIframe.js";
import iframeMain from "./modalIframe.js";
import selecaoMain from "./selecao.js";

//Selecao
selecaoMain();

//Modal
modal.modalMain();

//meuModal
if (meuModal.openModalButton) {
  meuModal.openCadastroModal();
}

if (meuModal.closeButtonEquipe) {
  meuModal.closeCadastroModal();
}

//Avaliação
if (statusAvaliacao.statusAvaliacaoP) {
  await statusAvaliacao.exibeStatusAvaliacao();
}

//Iframe
iframeMain();

//Funções
function redirecionar(url) {
  window.location.href = url;
}

const adm_password = "admin";

function verificaSenha(url) {
  let input_senha = document.querySelector("#inp_senha");
  if (input_senha.value == adm_password) {
    input_senha.value = "";
    redirecionar(url);
  }
}

export default {
  verificaSenha,
  redirecionar,
};
