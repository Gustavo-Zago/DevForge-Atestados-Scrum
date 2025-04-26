const mainChilds = document.querySelectorAll(
  "main > section:not(:first-child)"
);
const aside = document.querySelector(".mensagem-aside");
const buttonsAvalia = document.querySelectorAll(".btnAvalia");
const buttonsPergunta = document.querySelectorAll(".Fimdapagina");
const selectEquipe = document.getElementById("teamselection");
const selectAvaliador = document.getElementById("Avaliador");
const selectAvaliado = document.getElementById("Avaliado");

const btnProx = document.getElementById("proximo");
const btnAnt = document.getElementById("anterior");

//Notas
let nomeEquipe;
let avaliador;
let avaliado;
let notas = {};
let atualNota = NaN;
let currentIndex = 0;

avaliacaoStatus();
inicializaButtonClick();
eventoButtonClick();

function inicializaButtonClick() {
  disableButtonClick();
  disableProximoCarrosel();
  atualizarBotao();
  statusSelect(false, true, true);
}

function eventoButtonClick() {
  buttonsAvalia.forEach((button) => {
    button.addEventListener("click", () => handleButtonClick(button));
  });
}

function handleButtonClick(button) {
  let jaSelecionado = button.classList.contains("selecionado");

  removeButtonValue();

  if (!jaSelecionado) {
    button.classList.add("selecionado");
    enableProximoCarrosel();
    statusSelect(true, true, true);
    atualNota = button.getAttribute("data-nota");
    console.log(atualNota);
  } else {
    disableProximoCarrosel();
  }
}

function removeButtonValue() {
  buttonsAvalia.forEach((b) => b.classList.remove("selecionado"));
}

function removeSelectValue() {
  selectEquipe.value = "None";
  selectAvaliador.value = "None";
  selectAvaliado.value = "None";
}

selectEquipe.addEventListener("change", () => {
  verificaValor();
  nomeEquipe = selectEquipe.value;
  nomeEquipe = nomeEquipe.split("-")[0];
  avaliacaoStatus(nomeEquipe);
  fetch(`integrantesScrum?NOME=${encodeURIComponent(nomeEquipe)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const nomes = Array.isArray(data.integrantes)
        ? data.integrantes.filter((nome) => typeof nome === "string")
        : [];
      adicionaIntegrantes(nomes);
      statusSelect(false, false, false);
    })
    .catch((error) => {
      console.error("Erro na requisição ou no JSON:", error);
    });
});

selectAvaliador.addEventListener("change", () => {
  verificaValor();
  avaliador = selectAvaliador.value;
  avaliador = avaliador.split("-")[0];
  Array.from(selectAvaliado).forEach((opt) => (opt.disabled = false));
  selectAvaliado.querySelector(
    `option[value="${selectAvaliador.value}"]`
  ).disabled = true;
});

selectAvaliado.addEventListener("change", () => {
  verificaValor();
  avaliado = selectAvaliado.value;
  avaliado = avaliado.split("-")[0];
});

function avaliacaoStatus(nomeEquipe) {
  fetch(`/avaliacaoStatus?equipeNome=${nomeEquipe}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      let equipe = data.trim();
      if (equipe === "True") {
        console.log("True");
        mainChilds.forEach((child) => {
          child.classList.remove("desativado");
        });
        aside.classList.add("desativado");
      } else {
        console.log("False");
        mainChilds.forEach((child) => {
          child.classList.add("desativado");
        });
        aside.classList.remove("desativado");
      }
    })
    .catch((error) => console.error(error));
}

function verificaValor() {
  const allSelect =
    selectEquipe.value !== "None" &&
    selectAvaliador.value !== "None" &&
    selectAvaliado.value !== "None";

  allSelect ? enableButtonClick() : disableButtonClick();
}

function adicionaIntegrantes(integrantes) {
  let htmlOption = [
    '<option value="None" disabled selected>Selecione o integrante</option>',
  ];
  integrantes.forEach((integrante) => {
    opt = `<option value="${integrante}">${integrante}</option>`;
    htmlOption.push(opt);
  });

  selectAvaliador.innerHTML = htmlOption;
  selectAvaliado.innerHTML = htmlOption;
}

function statusSelect(statusEquipe, statusAvaliador, statusAvaliado) {
  selectEquipe.disabled = statusEquipe;
  statusEquipe == true
    ? selectEquipe.classList.add("disabled")
    : selectEquipe.classList.remove("disabled");
  selectAvaliador.disabled = statusAvaliador;
  statusAvaliador == true
    ? selectAvaliador.classList.add("disabled")
    : selectAvaliador.classList.remove("disabled");
  selectAvaliado.disabled = statusAvaliado;
  statusAvaliado == true
    ? selectAvaliado.classList.add("disabled")
    : selectAvaliado.classList.remove("disabled");
}

function enableButtonClick() {
  buttonsAvalia.forEach((b) => {
    b.classList.remove("disabled");
    b.disabled = false;
  });
}

function disableButtonClick() {
  buttonsAvalia.forEach((b) => {
    b.disabled = true;
    b.classList.add("disabled");
    b.classList.remove("selecionado");
  });
}

function enableProximoCarrosel() {
  btnProx.disabled = false;
  btnProx.classList.remove("disabled");
}

function disableProximoCarrosel() {
  btnProx.disabled = true;
  btnProx.classList.add("disabled");
}

function setNotas() {
  localStorage.setItem(
    nomeEquipe + "-" + avaliador + "-" + avaliado,
    JSON.stringify(notas)
  );
}

function removeUltimaChave() {
  const chaves = Object.keys(notas);
  const ultimaChave = chaves.at(-1);
  delete notas[ultimaChave];
  setNotas();
}

function resetAvaliacao() {
  enviarAvaliacao();
  currentIndex = 0;
  removeButtonValue();
  removeSelectValue();
  exibirPergunta(currentIndex);
  inicializaButtonClick();
  btnProx.removeEventListener("click", resetAvaliacao);
  btnProx.addEventListener("click", proximaPergunta);
}

function enviarAvaliacao() {
  try {
    fetch(
      `/enviarNotas?equipeNome=${encodeURIComponent(
        nomeEquipe
      )}&Avaliador=${encodeURIComponent(
        avaliador
      )}&Avaliado=${encodeURIComponent(avaliado)}$notas=${encodeURIComponent(
        notas
      )}`.then((response) => {
        if (!response.ok) {
          throw new Error(`Erro do servidor: ${response.status}`);
        }
      })
    );
  } catch (error) {
    console.error(error);
  }
}

//Carrosel
const wrapper = document.querySelector(".carrosel-wrapper");
const spanAvaliacao = document.getElementById("tipoAvalicao");
const tipoAvaliacao = [
  "Proatividade",
  "Autonomia",
  "Cooperação",
  "Entrega de Resultados",
];

function exibirPergunta(index) {
  const offset = index * -100;
  wrapper.style.transform = `translateX(${offset}%)`;
  spanAvaliacao.textContent = tipoAvaliacao[index];
  atualizarBotao();
}

function atualizarBotao() {
  btnAnt.disabled = currentIndex === 0;

  if (currentIndex === 3) {
    btnProx.textContent = "Enviar";
    btnProx.addEventListener("click", resetAvaliacao);
  } else {
    btnProx.textContent = "Próximo";
  }
}

function proximaPergunta() {
  notas[tipoAvaliacao[currentIndex]] = atualNota;
  setNotas();
  removeButtonValue();
  disableProximoCarrosel();

  currentIndex + 1 < tipoAvaliacao.length ? currentIndex++ : currentIndex;
  exibirPergunta(currentIndex);
}

btnProx.removeEventListener("click", resetAvaliacao);
btnProx.addEventListener("click", proximaPergunta);

btnAnt.addEventListener("click", () => {
  removeUltimaChave();
  removeButtonValue();

  currentIndex > 0 && currentIndex--;
  exibirPergunta(currentIndex);

  console.log(notas);
});
