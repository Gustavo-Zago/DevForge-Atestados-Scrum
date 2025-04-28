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

avaliacaoStatus(""); 
inicializaAvaliacao();
eventoButtonClick();
statusSelect(false, true, true);

function inicializaAvaliacao() {
  statusButtonClick(false);
  statusProximoCarrosel(false);
  atualizarBotao();
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
    statusProximoCarrosel(true);
    statusSelect(true, true, true);
    atualNota = button.getAttribute("data-nota");
  } else {
    statusProximoCarrosel(false);
  }
}

function removeButtonValue() {
  buttonsAvalia.forEach((b) => b.classList.remove("selecionado"));
}

function removeSelectValue() {
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
      if (data.avaliacao === true) {    
        mainChilds.forEach((child) => {
          child.classList.remove("desativado");
        });
        aside.classList.add("desativado");
      } else {
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

  allSelect ? statusButtonClick(true) : statusButtonClick(false);
}

function adicionaIntegrantes(integrantes) {
  let htmlOption = [
    '<option value="None" disabled selected>Selecione o integrante</option>',
  ];
  integrantes.forEach((integrante) => {
    const opt = `<option value="${integrante}">${integrante}</option>`;
    htmlOption.push(opt);
  });

  selectAvaliador.innerHTML = htmlOption;
  selectAvaliado.innerHTML = htmlOption;
}

function toggleDisabled(elemento, isDisabled) {
  elemento.disabled = isDisabled;
  elemento.classList.toggle("disabled", isDisabled);
}

function statusSelect(statusEquipe, statusAvaliador, statusAvaliado) {
  toggleDisabled(selectEquipe, statusEquipe);
  toggleDisabled(selectAvaliador, statusAvaliador);
  toggleDisabled(selectAvaliado, statusAvaliado);
}

function statusButtonClick(status) {
  buttonsAvalia.forEach((b) => {
    status
      ? ((b.disabled = false), b.classList.remove("disabled"))
      : ((b.disabled = true),
        b.classList.add("disabled"),
        b.classList.remove("selecionado"));
  });
}

function statusProximoCarrosel(status) {
  status
    ? ((btnProx.disabled = false), btnProx.classList.remove("disabled"))
    : ((btnProx.disabled = true), btnProx.classList.add("disabled"));
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
  inicializaAvaliacao();
  removeButtonValue();
  removeSelectValue();
  statusSelect(false, false, false);

  currentIndex = 0;
  exibirPergunta(currentIndex);
  btnProx.removeEventListener("click", resetAvaliacao);
  btnProx.addEventListener("click", proximaPergunta);
}

function enviarAvaliacao() {
  try {
    notasString = JSON.stringify(notas);
    dados = {
      equipeNome: nomeEquipe,
      Avaliador: avaliador,
      Avaliado: avaliado,
      notas: notasString,
    };
    fetch(`/enviarNotas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(dados),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro do servidor: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.mensagem);
      });
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
  statusProximoCarrosel(false);

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
