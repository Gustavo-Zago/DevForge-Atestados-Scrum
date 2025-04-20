listaBotoes = document.querySelectorAll(".btnAvalia");

listaBotoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    const jaSelecionado = botao.classList.contains("selecionado");
    listaBotoes.forEach((b) => b.classList.remove("selecionado"));

    if (!jaSelecionado) {
      botao.classList.add("selecionado");
    }
  });
});
