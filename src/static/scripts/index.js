import modal from "./modal.js";
import statusAvaliacao from "./statusAvaliacao.js";
import iframeMain from "./modalIframe.js";
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
iframeMain();

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
