const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "root",
  database: "softjobs",
  allowExitOnIdle: true,
});

const getUsuarios = async () => {
  const { rows: Usuarios } = await pool.query("SELECT * FROM usuarios");
  return Usuarios;
};

const verificarCredenciales = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";

  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);

  const { password: passwordEncriptada } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);
  if (!passwordEsCorrecta || !rowCount)
    throw {
      code: 401,
      message: "Email o contraseña incorrecta",
    };
};

const registrarUsuario = async (usuario) => {
  let { email, password } = usuario;
  const passwordEncriptada = bcrypt.hashSync(password);
  password = passwordEncriptada;
  const values = [email, passwordEncriptada];
  const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2)";
  await pool.query(consulta, values);
};

module.exports = {
  getUsuarios,
  verificarCredenciales,
  registrarUsuario,
};
