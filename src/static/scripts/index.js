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
modalIframe.addNotasModalEvent();

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
