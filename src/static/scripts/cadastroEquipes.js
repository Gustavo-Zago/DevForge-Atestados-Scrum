const inp_numIntegrantes = document.getElementById("inputNIn");

inp_numIntegrantes.addEventListener("keyup", gerarCampos);

function validaNumIntegrantes(num_integrantes) {
  if (num_integrantes === 0 || num_integrantes === "") {
    return true;
  }

  if (num_integrantes < 5 || num_integrantes > 9) {
    throw new Error("Número de integrantes inválido (deve ser entre 5 e 9)");
  }
}

function gerarCampos() {
  let num_integrantes = inp_numIntegrantes.value;
  console.log(num_integrantes);
  validaNumIntegrantes(num_integrantes);
  const container = document.getElementById("campos_integrantes");
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
