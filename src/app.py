from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
'''from pyscript import Element'''
import os
from datetime import datetime
i,x = 0,1
escolha = []
import uuid  # Para garantir nomes únicos de arquivos
from static.python.funcAtestado import *

teste()

i = 0
app = Flask(__name__, static_folder='')
app.secret_key = 'chave-secreta'
UPLOAD_FOLDER =  './src/static/uploads/atestados/' if __name__ == '__main__' else './static/uploads/atestados/'
UPLOAD_EQUIPE = './src/static/equipes/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
@app.route("/")
def index():
    return render_template("index.html"), 200

@app.route('/formAtestado')
def envio():
    return render_template('formAtestado.html')

@app.route('/scrum', methods=["GET"])
def scrum():
    try:
        with open(UPLOAD_EQUIPE+"equipes.txt", "r", encoding='utf-8') as file:
            equipesLinhas = file.readlines()

        equipesNome = []
        for linha in equipesLinhas:
            linha = linha.strip()

            if 'Nome da Equipe' in linha:
                chave_valor = linha.split(":", 1)
                chave, valor = chave_valor
                equipesNome.append(valor.strip())

        return render_template("scrum.html", equipes=equipesNome)
    except Exception as e:
        return str(e)
    
@app.route("/integrantesScrum")
def integrantes():
    nomeEquipe = request.args.get("NOME")
    print(nomeEquipe)
    try:
        with open(UPLOAD_EQUIPE+"equipes.txt", "r", encoding='utf-8') as file:
            equipesLinha = file.readlines()

            integrantes=[]
            equipe_achado = False
            for linha in equipesLinha:
                linha = linha.strip()
                if linha.strip().lower() == f"nome da equipe: {nomeEquipe.strip().lower()}":
                    equipe_achado = True
                    continue
                
                if equipe_achado and not linha:
                    equipe_achado = False
                    break
                
                if equipe_achado and linha:
                    chave_valor = linha.split(":", 1)
                    if len(chave_valor) == 2:
                        chave, valor = chave_valor
                        integrantes.append(valor.strip())
        print(integrantes)
        return jsonify({'integrantes': integrantes}), 200
    except Exception as e:
        return 'Equipe não encontrada', 404
                    


@app.route('/adminatestado')
def adminatestado():
    return render_template("adminAtestado.html")

@app.route('/adminscrum', methods=['GET'])
def ler_equipe():
    equipes = {}
    equipe_atual = None

    try:
        with open(UPLOAD_EQUIPE + 'equipes.txt', 'r', encoding='utf-8') as f:
            for linha in f:
                linha = linha.strip()
                if linha.startswith("Nome da Equipe:"):
                    equipe_atual = linha.replace("Nome da Equipe:", "").strip()
                    equipes[equipe_atual] = []
                elif linha.startswith("Nome do Integrante:") and equipe_atual:
                    integrante = linha.replace("Nome do Integrante:", "").strip()
                    equipes[equipe_atual].append(integrante)
    except FileNotFoundError:
        equipes = {}

    return render_template('adminScrum.html', equipes=equipes)

    

@app.route('/enviar', methods=['POST'])
def enviar():
    nome = request.form['nome']
    RA = request.form['RA']
    data_i = request.form['data_i']
    data_f = request.form['data_f']
    motivo = request.form['motivo']
    arquivo = request.files['arquivo']
    status = 'Pendente'

    if not arquivo:
        flash('Envie um arquivo válido!')
        return redirect(url_for('index'))
    
    #Calcula dias afastado
    def calcula_validade_atestado(data_i, data_f):
    
        diferenca = abs(datetime.strptime(data_f, "%Y-%m-%d") - datetime.strptime(data_i, "%Y-%m-%d"))
    
        return diferenca.days
    
    # Salvar o arquivo com um nome único para evitar sobrescrita
    file_ext = os.path.splitext(arquivo.filename)[1]  # Extrair a extensão do arquivo
    novo_nome = f"{RA}_{datetime.now().strftime('%d%m%Y%H%M%S')}{file_ext}"  # Novo nome com RA e timestamp
    caminho_arquivo = os.path.join("src/static/uploads/atestados", novo_nome)
    arquivo.save(caminho_arquivo)

    # Salvar os dados em um arquivo de texto
    with open(UPLOAD_FOLDER+'atestados.txt', 'a', encoding='utf-8') as f:
        f.write(f"Nome: {nome}\nRA do aluno: {RA}\nData Inicial: {data_i}\nData Final: {data_f}\nValidade: {calcula_validade_atestado(data_i, data_f)} dias\nMotivo: {motivo}\nArquivo: {caminho_arquivo}\nStatus: {status}\n\n")

    flash('Atestado enviado com sucesso!')
    return redirect(url_for('ler_txt'))

@app.route('/espera', methods=['GET'])
def ler_txt():
    try:
        with open(UPLOAD_FOLDER+'atestados.txt', 'r', encoding='utf-8') as f:
            linhas = f.readlines()
        #aqui começa a transoformar em um dicionario pra tratar melhor os dados tropa
        atestados = []
        atestado_atual = {}

        for linha in linhas:
            linha = linha.strip()
            
            if not linha:  # verifica linha vazia q mostra separação de registros
                if atestado_atual:  
                    atestados.append(atestado_atual)  # add o atestado na lista
                    atestado_atual = {}  # zera para o próximo
                continue  
            
            chave_valor = linha.split(":", 1)  # Divide na primeira ocorrência de ":"
            if len(chave_valor) == 2:
                chave, valor = chave_valor
                atestado_atual[chave.strip()] = valor.strip()  # Remove espaços extras
        
        if atestado_atual:  # Garante que o último atestado seja salvo
            atestados.append(atestado_atual)

        return render_template('espera.html', atestados=atestados)

    except FileNotFoundError:
        return render_template('espera.html', atestados= 'Ih deu ruim')
    
@app.route("/header")
def header():
    return render_template('header.html')

@app.route("/scrum", methods=["GET", "POST"])
def submit():
    media = 0 
    x = len(escolha)
    if request.method == "POST":
        if x < 5:  # Permite no máximo five escolhas
            escolha.append(request.form.get("options"))
        else:
            media = sum(int(i) for i in escolha) / len(escolha)
    return render_template("scrum.html", escolha=escolha, x=x, media=media)

@app.route("/buscar-atestado")
def buscar():
    try:
        with open(UPLOAD_FOLDER + 'atestados.txt', 'r', encoding='utf-8') as file:
            atestados = file.readlines()
            statusLista = []
            RA = request.args.get("RA")
            for i, linha in  enumerate(atestados):
                if linha.startswith("RA do aluno:"):
                    raLinha = linha.split(":")[1].strip()
                
                    if (RA == raLinha):
                        statusLinha = atestados[i+6]
                        if (statusLinha.startswith('Status:')):
                            status = statusLinha.split(":")[1].strip()
                            statusLista.append(status)
            if statusLista:
                print(statusLista)
                return jsonify({"status": statusLista[-1]})
                
            return jsonify({"status": "Não Encontrado"})
    except FileNotFoundError:
        return render_template('Espera.html')
          
           

@app.route("/gestaoat", methods=["GET"])
def gestao():
    try:
        with open(UPLOAD_FOLDER+'atestados.txt', 'r', encoding='utf-8') as f:
            linhas = f.readlines()
        #aqui começa a transoformar em um dicionario pra tratar melhor os dados tropa
        atestados = []
        atestado_atual = {}
        for linha in linhas:
            
            linha = linha.strip()
            
            if not linha:  # verifica linha vazia q mostra separação de registros
                if atestado_atual and atestado_atual['Status'] == 'Pendente': # aqui ele vê se for Pendente, se for ele mostra, senão zera
                    atestados.append(atestado_atual)  # add o atestado na lista
                atestado_atual = {}  # zera para o próximo
                continue  
            
            chave_valor = linha.split(":", 1)  # Divide na primeira ocorrência de ":"
            if len(chave_valor) == 2:
                chave, valor = chave_valor
                atestado_atual[chave.strip()] = valor.strip()  # Remove espaços extras

        if atestado_atual and atestado_atual['Status'] == 'Pendente':# Garante que o último atestado seja salvo
            atestados.append(atestado_atual)
        
        return render_template('GestãoDeAtestados.html', atestados=atestados)

    except FileNotFoundError:
        return render_template('GestãoDeAtestados.html', atestados= 'Ih deu ruim')

@app.route("/alterarStatus")
def alterarStatus():
    url = request.args.get("URL")
    status = request.args.get("status")
    try:
        with open(UPLOAD_FOLDER + 'atestados.txt', 'r', encoding='utf-8') as file:
            atestados = file.readlines()

        indexLinhaStatus = 0
        for i, linha in enumerate(atestados):
            if url in linha:
                indexLinhaStatus = i+1
                break
        
        atestados.pop(indexLinhaStatus)
        atestados.insert(indexLinhaStatus, "Status: "+status+"\n")

        with open(UPLOAD_FOLDER + 'atestados.txt', 'w', encoding='utf-8') as fileW:
                fileW.writelines(atestados)

        return f'Sucesso', 200  

    except Exception as e:
        return f'Erro ao atualizar o status: {str(e)}', 500  

    
@app.route("/cadastroequipes", methods=["GET", "POST"])
def cadastro_equipes():
    UPLOAD_EQUIPE = './src/static/equipes/'
    
    if request.method == "POST":
        nome_equipe = request.form.get("nome_equipe")
        num_integrantes = request.form.get("num_integrantes")

        if nome_equipe and num_integrantes and not request.form.get("nome_0"):
            try:
                num_integrantes = int(num_integrantes)
                if not (5 <= num_integrantes <= 9):
                    flash("A equipe deve ter entre 5 e 9 integrantes.")
                    return redirect(request.url)
                return render_template("cadastroequipes.html", num_integrantes=num_integrantes)
            except ValueError:
                flash("Número de integrantes inválido.")
                return redirect(request.url)

        try:
            num_integrantes = int(num_integrantes)
        except ValueError:
            flash("Número inválido de integrantes.")
            return redirect(request.url)

        integrantes = []
        for i in range(num_integrantes):
            nome = request.form.get(f"nome_{i}")
            funcao = request.form.get(f"funcao_{i}")
            if not nome or not funcao:
                flash("Integrante ou função em branco.")
                return redirect(request.url)
            integrantes.append((nome, funcao))

        with open(UPLOAD_EQUIPE + "equipes.txt", "a", encoding="utf-8") as f:
            f.write(f"Nome da Equipe: {nome_equipe}\n")
            for nome, funcao in integrantes:
                f.write(f"Nome do Integrante: {nome} - {funcao}\n")
            f.write("\n")

        flash("Equipe cadastrada com sucesso!")
        return redirect("cadastroequipes")

    return render_template("cadastroequipes.html", num_integrantes=None)

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
