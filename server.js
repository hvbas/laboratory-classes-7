const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const { PORT } = require("./config");
const logger = require("./utils/logger");
const { connectToDatabase } = require('./database');
const productsRoutes = require("./routing/products");
const logoutRoutes = require("./routing/logout");
const killRoutes = require("./routing/kill");
const homeRoutes = require("./routing/home");
const { STATUS_CODE } = require("./constants/statusCode");
const { MENU_LINKS } = require("./constants/navigation");
const cartController = require("./controllers/cartController");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((request, _response, next) => {
  const { url, method } = request;

  logger.getInfoLog(url, method);
  next();
});

app.use("/products", productsRoutes);
app.use("/logout", logoutRoutes);
app.use("/kill", killRoutes);
app.use(homeRoutes);
app.use(async (request, response) => {
  try {
    const { url } = request;
    const cartCount = await cartController.getProductsCount();

    response.status(STATUS_CODE.NOT_FOUND).render("404", {
      headTitle: "404",
      menuLinks: MENU_LINKS,
      activeLinkPath: "",
      cartCount,
    });
    logger.getErrorLog(url);
  } catch (error) {
    console.error('Error in 404 handler:', error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send('Something went wrong!');
  }
});

// Connect to MongoDB and start the server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
