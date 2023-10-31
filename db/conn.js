const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("toughts", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

try {
  sequelize.authenticate();
  console.log("Conectado com sucesso");
} catch (error) {
  console.log("Não foi possivel conectar", error);
}

module.exports = sequelize;
