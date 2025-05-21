const statusAvaliacaoP = document.querySelectorAll(".statusAvaliacao");

async function exibeStatusAvaliacao() {
  statusAvaliacaoP.forEach(async (p) => {
    const nomeEquipe = p.getAttribute("data-equipe");
    const status = await statusAvaliacaoCompleta(nomeEquipe);
    p.textContent = `Avaliação: ${status ? "Completa" : "Incompleta"}`;
  });
}

async function statusAvaliacaoCompleta(nomeEquipe) {
  try {
    const response = await fetch(
      `/verificaAvaliacaoCompleta?NomeEquipe=${encodeURIComponent(nomeEquipe)}`
    );

    if (!response.ok) {
      throw new Error("Equipe não encontrada");
    }

    const data = await response.json();
    return data.statusAvaliacao;
  } catch (error) {
    console.error("Erro ao buscar status da avaliação:", error);
    return null;
  }
}

export default {
  statusAvaliacaoP,
  exibeStatusAvaliacao,
  statusAvaliacaoCompleta,
};
