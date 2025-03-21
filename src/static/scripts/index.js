main = document.querySelector("main");
modal = document.getElementById("modal");
atestadoButton = document.getElementById("btn_atestado");
gestaoButton = document.getElementById("btn_gestao");
equipeButton = document.getElementById("btn_equipe");
admButton = document.getElementById("btn_adm");
closeButton = document.getElementById("close_modal");

adm_btn_senha = document.querySelector("#adm_btn_senha");

const adm_password = "admin";

atestadoButton.addEventListener("click", function () {
  redirecionar("/envio");
});

equipeButton.addEventListener("click", function () {
  redirecionar("/scrum");
});

gestaoButton.addEventListener("click", function () {
  modalAction("open");

  adm_btn_senha.addEventListener("click", function (e) {
    e.preventDefault();
    //alert("1")
    let input_senha = document.querySelector("#inp_senha").value;
    alert(input_senha)
    if (input_senha == adm_password){
      alert("Hello World!");
      redirecionar("/adminatestado");
      return
    }
  });

});

admButton.addEventListener("click", function () {
  modalAction("open");

  adm_btn_senha.addEventListener("click", function (e) {
    e.preventDefault();
    //alert("1")
    let input_senha = document.querySelector("#inp_senha").value;
    alert(input_senha)
    if (input_senha == adm_password){
      alert("Hello World!");
      redirecionar("/adminscrum");
      return
    }
  });
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
