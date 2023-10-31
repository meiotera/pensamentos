const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const conn = require("./db/conn");

const Tought = require("./models/Tought");
const User = require("./models/User");

// import Routes
const toughtsRoutes = require("./routes/toughtsRoutes");
const authRoutes = require("./routes/authRoutes");

// import Controller
const ToughtController = require("./controllers/ToughtController");

const app = express();

const hbs = exphbs.create({
  partialsDir: ["views/toughts"], // Define o diretório de parciais para as views de tasks
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// session midleware
app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "session"),
    }),
    cookie: {
      secure: false,
      maxAge: 86400000,
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
    },
  })
);

// flash messages
app.use(flash());

// public path
app.use(express.static("public"));

//set session to response
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

app.use("/toughts", toughtsRoutes);
app.use("/", authRoutes);

app.get("/", ToughtController.showToughts);

conn
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => console.log(error));
