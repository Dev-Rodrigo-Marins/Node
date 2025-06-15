const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Middleware para proteger rotas
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

// 🧾 Listar todos os relatos
router.get('/', (req, res) => {
  pool.query('SELECT r.*, u.nome, u.foto FROM relatos r JOIN usuarios u ON r.usuario_id = u.id ORDER BY r.criado_em DESC', (err, results) => {
    res.render('dashboard', { relatos: results, user: req.user || null});// envia o usuario (ou null se deslogado)
  });
});

// 📝 Formulário de novo relato
router.get('/novo', ensureAuthenticated, (req, res) => {
  res.render('form', { relato: null });
});

// 💾 Criar relato
router.post('/novo', ensureAuthenticated, upload.single('arquivo'), (req, res) => {
  const { titulo, descricao } = req.body;
  const arquivo = req.file.filename;
  const usuario_id = req.user.id;

  pool.query('INSERT INTO relatos (titulo, descricao, arquivo, usuario_id) VALUES (?, ?, ?, ?)',
    [titulo, descricao, arquivo, usuario_id],
    () => res.redirect('/relatos'));
});

// ✏️ Formulário de edição
router.get('/editar/:id', ensureAuthenticated, (req, res) => {
  pool.query('SELECT * FROM relatos WHERE id = ?', [req.params.id], (err, results) => {
    if (results.length === 0 || results[0].usuario_id !== req.user.id) return res.redirect('/relatos');
    res.render('form', { relato: results[0] });
  });
});

// 🔄 Atualizar relato
router.post('/editar/:id', ensureAuthenticated, upload.single('arquivo'), (req, res) => {
  const { titulo, descricao } = req.body;
  const id = req.params.id;

  pool.query('SELECT * FROM relatos WHERE id = ?', [id], (err, results) => {
    if (results[0].usuario_id !== req.user.id) return res.redirect('/relatos');

    const campos = [titulo, descricao];
    let sql = 'UPDATE relatos SET titulo = ?, descricao = ?';
    if (req.file) {
      sql += ', arquivo = ?';
      campos.push(req.file.filename);
    }
    sql += ' WHERE id = ?';
    campos.push(id);

    pool.query(sql, campos, () => res.redirect('/relatos'));
  });
});

// 🗑️ Excluir relato
router.get('/deletar/:id', ensureAuthenticated, (req, res) => {
  pool.query('SELECT * FROM relatos WHERE id = ?', [req.params.id], (err, results) => {
    if (results.length === 0 || results[0].usuario_id !== req.user.id) return res.redirect('/relatos');
    pool.query('DELETE FROM relatos WHERE id = ?', [req.params.id], () => res.redirect('/relatos'));
  });
});

module.exports = router;
