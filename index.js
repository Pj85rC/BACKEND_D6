const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { reportarConsulta } = require("./middlewares");
const {
  getUsuarios,
  verificarCredenciales,
  registrarUsuario,
} = require("./consultas");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/usuarios", reportarConsulta, async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

app.post("/login", reportarConsulta, async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarCredenciales(email, password);
    const token = jwt.sign({ email }, "az_AZ", { expiresIn: 60 });
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
});

app.post("/usuarios", reportarConsulta, async (req, res) => {
  try {
    const usuario = req.body;
    await registrarUsuario(usuario);
    res.send("Usuario creado con éxito");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, console.log("Server ON"));

app.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe");
});
