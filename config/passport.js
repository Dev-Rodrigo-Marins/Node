const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
      const { id, displayName, emails, photos } = profile;
pool.query('SELECT * FROM usuarios WHERE google_id = ?', [id], (err, results) => {
  if (err) return done(err);

  if (results.length > 0) return done(null, results[0]);

  pool.query(
    'INSERT INTO usuarios (google_id, nome, email, foto) VALUES (?, ?, ?, ?)',
    [id, displayName, emails[0].value, photos[0].value],
    (err, result) => {
      if (err) return done(err);

      const newUser = {
        id: result.insertId,
        google_id: id,
        nome: displayName,
        email: emails[0].value,
        foto: photos[0].value
      };
      done(null, newUser);
    }
  );
});
    }
  ));

  passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  pool.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
    if (err) return done(err);
    if (results.length === 0) return done(null, false);
    done(null, results[0]);
  });
});
};
