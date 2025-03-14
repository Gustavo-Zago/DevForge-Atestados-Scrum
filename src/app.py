from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
'''from pyscript import Element'''
import os
from datetime import datetime
i,x = 0,1
escolha = []
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
    return render_template("scrum.html")


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
        data1 = datetime.strptime(data_i, "%Y-%m-%d")   
        data2 = datetime.strptime(data_f, "%Y-%m-%d")
    
        diferenca = abs(data2 - data1)
    
        return diferenca.days
    
    #validade = calcula_validade_atestado(data_i, data_f)

    caminho_arquivo = os.path.join(UPLOAD_FOLDER, arquivo.filename)
    arquivo.save(caminho_arquivo)

    # Salvar os dados em um arquivo de texto
    with open('atestados.txt', 'a', encoding='utf-8') as f:
        f.write(f"Nome: {nome}\nRA do aluno: {RA}\nData Inicial: {data_i}\nData Final {data_f}\nValidade: {calcula_validade_atestado(data_i, data_f)} dias\nMotivo: {motivo}\nArquivo: {caminho_arquivo}\nStatus: {status}\n\n")

    flash('Atestado enviado com sucesso!')
    return redirect(url_for('ler_txt'))

@app.route('/espera', methods=['GET'])
def ler_txt():
    try:
        with open('atestados.txt', 'r', encoding='utf-8') as f:
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

        return render_template('Espera.html', atestados=atestados)

    except FileNotFoundError:
        return render_template('Espera.html', atestados= 'Ih deu ruim')
    
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

def header():
    return render_template('header.html')
        
if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
