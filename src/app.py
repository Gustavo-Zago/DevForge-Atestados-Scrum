from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import os
from datetime import datetime
import uuid  # Para garantir nomes únicos de arquivos

app = Flask(__name__)
app.secret_key = 'chave-secreta'
UPLOAD_FOLDER = 'src/static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html"), 200

@app.route('/envio')
def envio():
    return render_template('formAtestado.html')

@app.route('/scrum')
def scr():
    return render_template('scrum.html')

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
    
    # Calcula dias afastado
    def calcula_validade_atestado(data_i, data_f):
        data1 = datetime.strptime(data_i, "%d-%m-%Y")   
        data2 = datetime.strptime(data_f, "%d-%m-%Y")
    
        diferenca = abs(data2 - data1)
    
        return diferenca.days
    
    # Salvar o arquivo com um nome único para evitar sobrescrita
    file_ext = os.path.splitext(arquivo.filename)[1]  # Extrair a extensão do arquivo
    novo_nome = f"{RA}_{datetime.now().strftime('%Y%m%d%H%M%S')}{file_ext}"  # Novo nome com RA e timestamp
    caminho_arquivo = os.path.join(UPLOAD_FOLDER, novo_nome)
    arquivo.save(caminho_arquivo)

    # Salvar os dados em um arquivo de texto
    with open('atestados.txt', 'a', encoding='utf-8') as f:
        f.write(f"Nome: {nome}\nRA do aluno: {RA}\nData Inicial: {data_i}\nData Final {data_f}\nValidade: {calcula_validade_atestado(data_i, data_f)} dias\nMotivo: {motivo}\nArquivo: {caminho_arquivo}\nStatus: {status}\n\n")

    flash('Atestado enviado com sucesso!')
    return redirect(url_for('ler_txt'))

@app.route('/Espera.html', methods=['GET'])
def ler_txt():
    try:
        with open('atestados.txt', 'r', encoding='utf-8') as f:
            linhas = f.readlines()
        # aqui começa a transformar em um dicionário pra tratar melhor os dados
        atestados = []
        atestado_atual = {}

        for linha in linhas:
            linha = linha.strip()
            
            if not linha:  # verifica linha vazia que mostra separação de registros
                if atestado_atual:  
                    atestados.append(atestado_atual)  # adiciona o atestado na lista
                    atestado_atual = {}  # zera para o próximo
                continue  
            
            chave_valor = linha.split(":", 1)  # Divide na primeira ocorrência de ":"
            if len(chave_valor) == 2:
                chave, valor = chave_valor
                atestado_atual[chave.strip()] = valor.strip()  # Remove espaços extras
        
        if atestado_atual:  # Garante que o último atestado seja salvo
            atestados.append(atestado_atual)

        return render_template('Espera.html', atestados=atestados)

    except FileNotFoundError:
        return render_template('Espera.html', atestados= 'Ih deu ruim')
    
@app.route("/header")
def header():
    return render_template('header.html')
        
if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
