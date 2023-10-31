const Tought = require("../models/Tought");
const User = require("../models/User");

const { Op } = require("sequelize");

module.exports = class ToughtController {
  static async showToughts(req, res) {
    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    let order = req.query.order === "old" ? "ASC" : "DESC";

    const toughtData = await Tought.findAll({
      include: User,
      where: {
        title: {
          [Op.like]: `%${search}%`,
        },
      },
      order: [["createdAt", order]],
    });

    const arrayToughts = toughtData.map((result) => {
      const tought = result.dataValues;
      const user = result.User.dataValues;

      return {
        title: tought.title,
        userName: user.name,
      };
    });

    let toughtQtd = arrayToughts.length;

    if (toughtQtd === 0) {
      toughtQtd = false;
    }

    res.render("toughts/home", { arrayToughts, search, toughtQtd });
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: Tought,
      plain: true,
    });

    if (!user) {
      res.redirect("/login");
    }

    const toughts = user.Toughts.map((result) => result.dataValues);
    let pensamentosVazios = false;

    if (toughts.length === 0) {
      pensamentosVazios = true;
    }
    res.render("toughts/dashboard", { toughts, pensamentosVazios });
  }

  static createTought(req, res) {
    res.render("toughts/create");
  }

  // criando pensamentos
  static async createToughtPost(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);
      req.flash("message", "Pensamento criado com sucesso!");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }

  // remevendo pensamentos
  static async removeTought(req, res) {
    const id = req.body.id;

    //pegando id do ususario pela sessao
    const UserId = req.session.userid;

    try {
      await Tought.destroy({ where: { id: id, UserId: UserId } });

      req.flash("message", "Pensamento removido!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }

  // edit
  static async edit(req, res) {
    const id = req.params.id;

    const tought = await Tought.findOne({ raw: true, where: { id: id } });

    res.render("toughts/edit", { tought });
  }

  static async editPost(req, res) {
    const id = req.body.id;

    const tought = {
      title: req.body.title,
    };

    try {
      await Tought.update(tought, { where: { id: id } });

      req.flash("message", "Pensamento editado com sucesso!");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }
};
