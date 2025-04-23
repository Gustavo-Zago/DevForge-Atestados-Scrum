const buttonsAvalia = document.querySelectorAll(".btnAvalia");
const buttonsPergunta = document.querySelectorAll(".Fimdapagina");
const selectEquipe = document.getElementById("teamselection");
const selectAvaliador = document.getElementById("Avaliador");
const selectAvaliado = document.getElementById("Avaliado");

const btnProx = document.getElementById("proximo");
const btnAnt = document.getElementById("anterior");
let selectedNotas = {};
let atualNota = NaN;
let currentIndex = 0;

inicializaButtonClick();

function inicializaButtonClick() {
  disableButtonClick();
  disableProximoCarrosel();
  atualizarBotao();

  buttonsAvalia.forEach((button) => {
    button.addEventListener("click", () => handleButtonClick(button));
  });
}

function handleButtonClick(button) {
  const jaSelecionado = button.classList.contains("selecionado");

  removeButtonValue();

  if (!jaSelecionado) {
    button.classList.add("selecionado");
    enableProximoCarrosel();
    statusSelect(true);
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
  let nomeEquipe = selectEquipe.value;
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
    })
    .catch((error) => {
      console.error("Erro na requisição ou no JSON:", error);
    });
});

selectAvaliador.addEventListener("change", () => {
  verificaValor();
  Array.from(selectAvaliado).forEach((opt) => (opt.disabled = false));
  selectAvaliado.querySelector(
    `option[value="${selectAvaliador.value}"]`
  ).disabled = true;
});

selectAvaliado.addEventListener("change", verificaValor);

function verificaValor() {
  const allSelect =
    selectEquipe.value !== "None" &&
    selectAvaliador.value !== "None" &&
    selectAvaliado.value !== "None";

  allSelect ? enableButtonClick() : disableButtonClick();
  console.log(allSelect);
}

function adicionaIntegrantes(integrantes) {
  let htmlOption = [
    '<option value="None" disabled selected>Selecione o avaliador</option>',
  ];
  integrantes.forEach((integrante) => {
    opt = `<option value="${integrante}">${integrante}</option>`;
    htmlOption.push(opt);
  });

  selectAvaliador.innerHTML = htmlOption;
  selectAvaliado.innerHTML = htmlOption;
}

function statusSelect(status) {
  selectEquipe.disabled = status;
  selectAvaliador.disabled = status;
  selectAvaliado.disabled = status;
}

function enableButtonClick() {
  buttonsAvalia.forEach((b) => b.classList.remove("noClick"));
}

function disableButtonClick() {
  buttonsAvalia.forEach((b) => {
    b.classList.add("noClick");
    b.classList.remove("selecionado");
  });
}

function enableProximoCarrosel() {
  btnProx.disabled = false;
}

function disableProximoCarrosel() {
  btnProx.disabled = true;
}

function setNotas() {
  localStorage.setItem(
    selectEquipe.value +
      "-" +
      selectAvaliador.value +
      "-" +
      selectAvaliado.value,
    JSON.stringify(selectedNotas)
  );
}

function removeUltimaChave() {
  const chaves = Object.keys(selectedNotas);
  const ultimaChave = chaves.at(-1);
  delete selectedNotas[ultimaChave];
  setNotas();
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

  function resetAvaliacao() {
    currentIndex = 0;
    removeButtonValue();
    removeSelectValue();
    disableButtonClick();
    disableProximoCarrosel();
    atualizarBotao();
    statusSelect(false);
    exibirPergunta(currentIndex);
  }

  if (currentIndex === 3) {
    btnProx.textContent = "Enviar";
    btnProx.addEventListener("click", () => {
      resetAvaliacao();
    });
  } else {
    btnProx.textContent = "Próximo";
  }
}

btnProx.addEventListener("click", () => {
  selectedNotas[tipoAvaliacao[currentIndex]] = atualNota;
  setNotas();
  removeButtonValue();

  currentIndex + 1 < tipoAvaliacao.length ? currentIndex++ : currentIndex;
  exibirPergunta(currentIndex);

  console.log(selectedNotas);
});

btnAnt.addEventListener("click", () => {
  removeUltimaChave();
  removeButtonValue();

  currentIndex > 0 && currentIndex--;
  exibirPergunta(currentIndex);

  console.log(selectedNotas);
});
