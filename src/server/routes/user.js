/*CONFIGURACION ROUTER (EXPRESS) */
const express = require("express");
const router = express.Router();

/*CONTROLADORES */
const userController = require("../controllers/userController");

/*VALIDADORES DE FORMULARIOS (EXPRESS-VALIDATOR)*/
const { check } = require("express-validator");
const validateForm = require("../middlewares/validateForm");
const validateLoginForm = require("../middlewares/validateLoginForm");

/*-------------------------------------------------------------------------*/

/* GET formulario Registro de Usuario */
router.get("/register", userController.register);

/* GET formulario Login de Usuario */
router.get("/login", userController.login);

/* POST formulario Login de Usuario */
router.post("/login/userProfile", validateLoginForm, userController.userLogin);

/* POST Registro de Usuario */
router.post(
  "/register",
  [
    check("nombreDeUsuario", "Por favor ingrese un nombre válido")
      .not()
      .isEmpty(),
    check("emailUsuario", "Por favor ingrese un email válido").isEmail(),
    check(
      "passUsuario",
      "La contraseña debe tener al menos 7 caracteres"
    ).isLength({ min: 6 }),
    validateForm(),
  ],
  userController.newAccount
);

module.exports = router;
