const inp_numIntegrantes = document.getElementById("inputNIn");
const container = document.getElementById("campos_integrantes");
const inp_nomeEquipe = document.getElementById("nome_equipe");

inp_numIntegrantes.addEventListener("keyup", gerarCampos);

async function validaNumIntegrantes(num_integrantes) {
  const nome_equipe = inp_nomeEquipe.value;
  try{
    await fetch(`/verificaequipe?nome_equipe=${encodeURIComponent(nome_equipe)}`)
    .then((response)=>{
      if (response.ok){
        throw new Error("Equipe exixtente")
      }
    })
  }
  catch(error){
    throw new Error("Erro ao acessar o servidor")
  }
  if (num_integrantes < 5 || num_integrantes > 9) {
    container.innerHTML = "";
    throw new Error("Número de integrantes inválido (deve ser entre 5 e 9)");
  }
}

async function gerarCampos() {
  let num_integrantes = inp_numIntegrantes.value;
  try{
    await validaNumIntegrantes(num_integrantes);
    
    container.innerHTML = "";
    
    for (let i = 0; i < num_integrantes; i++) {
      container.innerHTML += `
      <section>
          <div class="labelInputNome">
          <label>Nome:</label><br>
          <input type="text" name="nome_${i}" required>
          </div>
    
          <div class="labelInputFunc">
          <label>Função:</label><br>
          <select type="text" name="funcao_${i}" required>
              <option value="Team Developer">Team Developer</option>
              <option value="Product Owner">Product Owner</option>
              <option value="Scrum Master">Scrum Master</option>
          </select>
          </div>
      </section>
      `;
      }
    }
  catch(error){
    throw new Error("Erro na validação")
    container.innerHTML = "";
    console.error(error.message);
  }

}
