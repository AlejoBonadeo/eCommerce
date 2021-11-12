const { hashSync, genSaltSync } = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const usersFilePath = path.resolve(__dirname, "../data/Users.json");

const { validationResult } = require("express-validator");


/*-----------------------------------------------------------------------*/
/* CONTROLADOR DE USUARIO*/

const userController = {
  /* RENDERIZA FORMULARIO DE REGISTRO DE USUARIO */
  register: (req, res) => {
    res.render("./user/register");
  },

  /* RENDERIZA FORMULARIO DE LOGIN DE USUARIO */
  login: (req, res) => {
    res.render("./user/login");
  },

  /*CREACION DE NUEVO USUARIO EN DATA BASE*/
  newAccount: (req, res) => {
    //TODO agregar multer
    let users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
    const { body } = req;

    if (body.passUsuario !== body.repeatpassUsuario) {
      return res.render("./user/register", {
        error: "Ambas contraseñas deben ser iguales",
      });
    }
    for (user of users) {
      if (user.emailUsuario === body.emailUsuario) {
        return res.render("./user/register", {
          error: "El email ya esta registrado",
        });
      }
    }

    const salt = genSaltSync();
    body.passUsuario = hashSync(body.passUsuario, salt);

    delete body.aceptaTerminos;
    delete body.repeatpassUsuario;

    users = [
      ...users,
      {
        idUsuario: new Date().getTime(),
        ...body,
      },
    ];

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 3));

    delete body.passUsuario;
    req.session.user = { ...body };
    // console.log(req.session)

    res.redirect("/");
  },

  /*LOGIN DE USUARIO EN APLICACION*/
  processLogin: (req, res) => {
    let users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));

    let errors = validationResult(req);

    if (errors.isEmpty()) {
      let loggedUser = users.find((usr) => {
        if (
          usr.emailUsuario == req.body.emailUsuario &&
          usr.passUsuario == req.body.passUsuario
        ) {
          return usr;
        }
      });

      if (loggedUser != undefined) {
        res.render("./user/userDetails", { loggedUser });
      } else {
        res.send("Usuario no encontrado");
      }
    } else {
        res.render("./user/login", { errors: errors.mapped(), oldBody: req.body });
    }
  },
};

module.exports = userController;
