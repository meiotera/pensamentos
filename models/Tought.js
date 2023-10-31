/*############## incluidos na aula 04 ############## */
const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const User = require("./User");

const Tought = db.define("Tought", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
});

// Um pesamento pertence a um usuário
Tought.belongsTo(User);
// Um usuário tem varios pensamentos
User.hasMany(Tought);

module.exports = Tought;
/* --------------------fim na aula 04--------------------- */
