main = document.querySelector("main");
modal = document.getElementById("modal");
atestadoButton = document.getElementById("btn_atestado");
gestaoButton = document.getElementById("btn_gestao");
equipeButton = document.getElementById("btn_equipe");
admButton = document.getElementById("btn_adm");
closeButton = document.getElementById("close_modal");

atestadoButton.addEventListener("click", function () {
  redirecionar("/envio");
});

equipeButton.addEventListener("click", function () {
  redirecionar("/");
});

gestaoButton.addEventListener("click", function () {
  modalAction("open");
  // if (senha correta){
  //  redirecionar("/");
  // }
});

admButton.addEventListener("click", function () {
  modalAction("open");
  // if (senha correta) {
  //   redirecionar("/")
  // }
});

closeButton.addEventListener("click", () => {
  modalAction("close");
});

function redirecionar(url) {
  window.location.href = url;
}

function modalAction(action) {
  modal.style.display = action == "open" ? "flex" : "none";
  main.classList.toggle("blur");

  listaBotao = document.querySelectorAll(".botao");
  listaBotao.forEach((botao) => {
    botao.classList.toggle("noClick");
  });
}
