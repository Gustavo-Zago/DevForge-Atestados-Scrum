main = document.querySelector("main");
modal = document.getElementById("modal");
gestaoButton = document.getElementById("btn_gestao");
admButton = document.getElementById("btn_adm");
closeButton = document.getElementById("close_modal");

gestaoButton.addEventListener("click", function () {
  modalAction("open");
});

admButton.addEventListener("click", function () {
  modalAction("open");
});

closeButton.addEventListener("click", () => {
  modalAction("close");
});

function modalAction(action) {
  modal.style.display = action == "open" ? "flex" : "none";
  main.classList.toggle("blur");

  listaBotao = document.querySelectorAll(".botao");
  listaBotao.forEach((botao) => {
    botao.classList.toggle("noClick");
  });
}
