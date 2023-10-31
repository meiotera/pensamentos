const express = require("express");
const router = express.Router();
const ToughtController = require("../controllers/ToughtController");

// midelware de proteção se usuario não estiver logado
// Não consegue acessar dashboard caso não esteja logado
const checkAuth = require("../helpers/auth").checkAuth;

router.get("/add", checkAuth, ToughtController.createTought);
router.post("/add", checkAuth, ToughtController.createToughtPost);
router.get("/dashboard", checkAuth, ToughtController.dashboard);

// remoção de itens
router.post("/remove", checkAuth, ToughtController.removeTought);
// rota / que chama uma função no controller
router.get("/", ToughtController.showToughts);

router.get("/edit/:id", checkAuth, ToughtController.edit);
router.post("/edit", checkAuth, ToughtController.editPost);

module.exports = router;
