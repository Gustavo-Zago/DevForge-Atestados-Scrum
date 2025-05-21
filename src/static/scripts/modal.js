const main = document.querySelector("main");
const header = document.querySelector("header");
const modal = document.getElementById("modal");
const closeButton = document.getElementById("close_modal");

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

  const listaBotao = document.querySelectorAll(".botao");
  listaBotao.forEach((botao) => {
    botao.classList.toggle("noClick");
  });
}

function closeModal() {
  closeButton.addEventListener("click", () => {
    modalAction("close");
    listaInputs = document.querySelectorAll("dialog input");
    listaInputs.forEach((input) => {
      input.value = "";
    });
  });
}

export default {
  modal,
  closeButton,
  modalAction,
  closeModal,
};
