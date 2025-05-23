const main = document.querySelector("main");
const header = document.querySelector("header");
const modal =
  document.getElementById("modal") || document.getElementById("modalIframe");
const closeButton = document.getElementById("close_modal");

function modalAction(action, tem_blur) {
  modal.style.display = action == "open" ? "flex" : "none";

  blurBackground(tem_blur);

  const listaBotao = document.querySelectorAll(".botao");
  listaBotao.forEach((botao) => {
    botao.classList.toggle("noClick");
  });
}

function blurBackground(tem_blur) {
  if (tem_blur) {
    if (main) {
      main.classList.add("blur");
      main.classList.add("noClick");
    }

    if (header) {
      header.classList.add("blur");
      header.classList.add("noClick");
    }
  } else {
    if (main) {
      main.classList.remove("blur");
      main.classList.remove("noClick");
    }

    if (header) {
      header.classList.remove("blur");
      header.classList.remove("noClick");
    }
  }
}

function clearInputsDialog() {
  const listaInputs = document.querySelectorAll(
    "dialog input:not([type=submit])"
  );
  if (listaInputs) {
    listaInputs.forEach((input) => {
      input.value = "";
    });
  }
}

function addCloseModal() {
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      modalAction("close");
      clearInputsDialog();
    });
  }
}

function modalMain() {
  addCloseModal();
}

export default {
  modalAction,
  modalMain,
};
