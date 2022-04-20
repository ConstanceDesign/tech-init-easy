const express = require("express");
const path = require("path");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const helpers = require("./utils/helpers");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({ helpers });
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Session
const sess = {
  secret: "Secret secret sauce",
  cookie: {
    maxAge: 1000000,
  },
  rolling: true,
  resave: true,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Routes
app.use(routes);

// Server Connection
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
