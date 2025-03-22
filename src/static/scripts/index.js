main = document.querySelector("main");
modal = document.getElementById("modal");
atestadoButton = document.getElementById("btn_atestado");
gestaoButton = document.getElementById("btn_gestao");
equipeButton = document.getElementById("btn_equipe");
admButton = document.getElementById("btn_adm");
enviarButton = document.getElementById("btn_enviar")
closeButton = document.getElementById("close_modal");

adm_btn_senha = document.querySelector("#adm_btn_senha");

const adm_password = "admin";

if (atestadoButton) {
  atestadoButton.addEventListener("click", function () {
    redirecionar("/envio");
  });
}

if (equipeButton) {
  equipeButton.addEventListener("click", function () {
    redirecionar("/scrum");
  });
}

if (gestaoButton) {
  gestaoButton.addEventListener("click", function () {
    modalAction("open");
  
    adm_btn_senha.addEventListener("click", function (e) {
      e.preventDefault();
      //alert("1")
      let input_senha = document.querySelector("#inp_senha").value;
      alert(input_senha)
      console.log(input_senha)
      if (input_senha == adm_password){
        alert("Hello World!");
        redirecionar("/adminatestado");
      }
    });
    // if (senha correta){
    //  redirecionar("/");
    // }
  });
}

if (admButton) {
  admButton.addEventListener("click", function () {
    modalAction("open");
    // if (senha correta) {
    //   redirecionar("/")
    // }
  });
  
}

if (enviarButton) {
  enviarButton.addEventListener("click", function () {
    modalAction("open")
  })
}

if (closeButton) {
  closeButton.addEventListener("click", () => {
    modalAction("close");
  });
}

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
