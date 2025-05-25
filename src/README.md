# Quer utilizar nosso sistema?

## O que é necessário:

Abaixo está um guia passo a passo de como executar e rodar nosso sistema em sua máquina:

### 1.Baixar o Git:

    - Primeiro instale o git para fazer a clonagem de nosso repositório: [Clique aqui para instalar o Git](https://git-scm.com/downloads)

### 2.Baixar o Python:

    - Também é necessário fazer a instalação do Python em sua máquina. Durante a instalação, não se esqueça de marcar a opção da instalação do "pip"; [Clique aqui para instalar o Python](https://www.python.org/downloads/).

<br>

# Clonando Repositório

Após todos os passos acima poderemos clonar o projeto para sua máquina local:

### 1.Clone o repositório pelo terminal, utilize o comando:

`git clone https://github.com/Gustavo-Zago/DevForge-Atestados-Scrum.git`

### 2.Ainda no terminal acesse a pasta `SRC`:

```
cd DevForge-Atestados-Scrum/
cd src/
```

### 3.Crie um ambiente virtual:
```
python -m venv venv
```

### 4.Inicie o ambiente virtual:
No windows:
```
./venv/Scripts/activate
```

No linux:
```
source ./venv/bin/activate
```

### 5.Instale as dependências:
```
pip install -r requirements.txt
```

### 6.Execute o Flask através do comando abaixo:

`flask run`

Esse comando irá criar as rotas e iniciar o servidor local da máquina, basta acessar:

`http://127.0.0.1:5000/`
