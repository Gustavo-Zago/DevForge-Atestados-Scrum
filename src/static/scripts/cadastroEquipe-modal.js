const openModalButton = document.getElementById("open_Modal_Button");
const meuModal = document.getElementById("meuModal");
const closeButtonEquipe = document.getElementById("closeButtonEquipe");

function openCadastroModal() {
  openModalButton.addEventListener("click", () => {
    meuModal.showModal();
  });
}
// Função para fechar o modal de cadastro de equipe
function closeCadastroModal() {
  closeButtonEquipe.addEventListener("click", () => {
    meuModal.close(); // Fecha o modal
  });
}

export default {
  openModalButton,
  closeButtonEquipe,
  openCadastroModal,
  closeCadastroModal,
};
