# 📝 Galeria de Relatos com Node.js, MySQL e Google OAuth

Este é um sistema simples de **galeria de relatos com upload de imagem**, onde usuários podem se autenticar com suas **contas Google**, criar relatos com imagem, visualizar relatos públicos e gerenciar seus próprios conteúdos (editar e excluir).

> Ideal como ponto de partida para projetos com autenticação social, CRUD e upload de arquivos.

---

## 📸 Demonstração

<img src="public/demo.gif" alt="Demonstração da aplicação" width="600">

---

## ⚙️ Funcionalidades

- Login com conta Google (OAuth 2.0)
- Upload de arquivos (com Multer)
- CRUD de relatos (título, descrição, imagem)
- Visualização pública dos relatos
- Restrições de edição/deleção para o autor
- Interface simples com Bootstrap

---

## 🧰 Tecnologias

- Node.js + Express
- Passport.js (Google OAuth)
- MySQL (via `mysql2`)
- EJS (Engine de views)
- Multer (upload de imagens)
- Bootstrap 5

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/Dev-Rodrigo-Marins/Node.git
cd Node.git
```

### 2. Instale as dependencias
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:
```bash
PORT=3000

# Google OAuth
GOOGLE_CLIENT_ID=SEU_CLIENT_ID
GOOGLE_CLIENT_SECRET=SEU_CLIENT_SECRET
CALLBACK_URL=http://localhost:3000/auth/google/callback

# Banco de dados MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=galeria

```
Substitua com seus dados do console do Google Cloud e do seu MySQL.

### 4. Crie o banco de dados
No seu MySQL, crie o banco e as tabelas:
```bash
CREATE DATABASE galeria;

USE galeria;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  google_id VARCHAR(255) NOT NULL,
  nome VARCHAR(255),
  email VARCHAR(255),
  foto TEXT
);

CREATE TABLE relatos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255),
  descricao TEXT,
  arquivo TEXT,
  usuario_id INT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```
### 5. Crie a pasta de uploads
```bash
mkdir public/uploads
```

### 6. Inicie o servidor
```bash
node app.js
```
Acesse em: http://localhost:3000

Como usar
```
Ao acessar a aplicação, clique em "Login com Google".
Após logado, você poderá criar um novo relato com título, descrição e imagem.
Relatos são exibidos publicamente.
Somente o autor pode editar ou excluir.
Relatos de outros usuários podem ser visualizados, mas não modificados.
```
Estrutura de pastas
```
.
├── app.js
├── routes/
│   └── relatos.js
├── config/
│   └── passport.js
├── views/
│   ├── layout.ejs
│   ├── dashboard.ejs
│   └── form.ejs
├── public/
│   ├── uploads/
│   └── css/
├── .env
└── README.md
```
🧑‍💻 Autor
Desenvolvido por Rodrigo Marins

📜 Licença
Este projeto está licenciado sob a MIT License


