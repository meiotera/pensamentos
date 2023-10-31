// Para usuario se autenticar temos que chamar o modulo do usuario
const User = require("../models/User");

// temos que criar a senha e criptografar pois o usuario está criando sua conta
const bcrypt = require("bcryptjs");

/* iniciado na aula 05 */
module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    // se usuario existe
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash("message", "Usuário não encontrado!");
      res.render("auth/login");

      return;
    }

    // chechando senha
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      req.flash("message", "Senha incorreta!");
      res.render("auth/login");

      return;
    }

    req.session.userid = user.id;

    req.flash("message", `bem vindo, o que você está pensando hoje ${user.name} ?`);

    req.session.save(() => {
      res.redirect("/");
    });
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    // validações do body
    const { name, email, password, confirmPassword } = req.body;

    const errors = [];

    Object.keys(req.body).forEach((key) => {
      if (req.body[key].trim() === "") {
        errors.push(`${key} não pode estar em branco!`);
      }
    });

    if (password !== confirmPassword) {
      errors.push("Senhas não conferem, tente novamente!");
    }

    if (errors.length > 0) {
      errors.forEach((erro) => {
        req.flash("message", erro);
      });

      res.render("auth/register");

      return;
    }

    // verificando se usuario existe
    const checkIfUserExists = await User.findOne({ where: { email: email } });

    if (checkIfUserExists) {
      req.flash("message", "E-mail já está cadastrado!");
      res.render("auth/register");

      return;
    }

    // criando password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // criando obejto de usuario
    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      // inicializar a sessao
      req.session.userid = createdUser.id;

      req.flash("message", "Cadastro realizado com sucesso!");

      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      console.log(error);
    }
  }

  // logout
  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};
