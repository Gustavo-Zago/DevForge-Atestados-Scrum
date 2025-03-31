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
UPLOAD_FOLDER = './src/static/uploads/atestados/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html"), 200

@app.route('/formAtestado')
def envio():
    return render_template('formAtestado.html')

@app.route('/scrum')
def scrum():
    return render_template("scrum.html")

@app.route('/adminatestado')
def adminatestado():
    return render_template("adminAtestado.html")

@app.route('/adminscrum')
def adminscrum():
    return render_template("adminScrum.html")

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

# @app.route("/view/<ra>", methods=['GET'])
# def visualizar_ra(ra):
#     arquivos = os.listdir(UPLOAD_FOLDER)
#     ra = ra.split("/")
#     print(ra)
#     for arquivo in arquivos:
#         if arquivo.startswith(ra):  # Verifica se o nome começa com o RA
#             caminho_arquivo = os.path.join('atestados', arquivo)
#             caminho_arquivo = "/static/uploads\\"+ caminho_arquivo
#             print(f"Arquivo encontrado: {caminho_arquivo}")
#             return render_template('view.html', caminho_arquivo=caminho_arquivo.replace('\\', '/'))
#             # return send_from_directory(caminho_arquivo)
    
#     return "Arquivo não encontrado", 404

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

@app.route("/aprovar", methods=["POST"])
def aprovar():
    # Pegando dados do formulário
    ra = request.form['ra']
    novo_status = "Aprovado"
    index = int(request.form['index'])  # Pega o índice enviado pelo formulário

    atestados_dir = os.path.join(UPLOAD_FOLDER, "atestados.txt")

    # Lê todas as linhas do arquivo de atestados
    with open(atestados_dir, "r", encoding="utf-8") as f:
        linhas = f.readlines()

    contador = -1
    i = 0

    while i < len(linhas):
        if f"RA do aluno: {ra}" in linhas[i]:
            contador += 1
            if contador == index:  # Encontra o índice correto
                while i < len(linhas):
                    if "Status:" in linhas[i]:
                        linhas[i] = f"Status: {novo_status}\n"  # Altera o status
                        break
                    i += 1
        i += 1

    # Salva as alterações no arquivo
    with open(atestados_dir, "w", encoding="utf-8") as f:
        f.writelines(linhas)

    return jsonify({"mensagem": f"Atestado do RA {ra} foi aprovado com sucesso!"})

@app.route("/reprovar", methods=["POST"])
def reprovar():
    # Verifica se 'index' foi enviado corretamente no formulário
    try:
        ra = request.form['ra']
        novo_status = "Reprovado"
        index = int(request.form['index'])  # Pegando o índice do formulário

        atestados_dir = os.path.join(UPLOAD_FOLDER, "atestados.txt")

        with open(atestados_dir, "r", encoding="utf-8") as f:
            linhas = f.readlines()

        contador = -1
        i = 0

        while i < len(linhas):
            if f"RA do aluno: {ra}" in linhas[i]:
                contador += 1
                if contador == index:
                    while i < len(linhas):
                        if "Status:" in linhas[i]:
                            linhas[i] = f"Status: {novo_status}\n"
                            break
                        i += 1
            i += 1

        with open(atestados_dir, "w", encoding="utf-8") as f:
            f.writelines(linhas)

        return jsonify({"mensagem": f"Atestado do RA {ra} foi reprovado com sucesso!"})

    except KeyError as e:
        return jsonify({"erro": f"Chave não encontrada: {str(e)}"}), 400
    
if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
