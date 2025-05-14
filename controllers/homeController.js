const { MENU_LINKS } = require("../constants/navigation");

const cartController = require("./cartController");

exports.getHomeView = async (request, response) => {
  try {
    const cartCount = await cartController.getProductsCount();

    response.render("home.ejs", {
      headTitle: "Shop - Home",
      path: "/",
      activeLinkPath: "/",
      menuLinks: MENU_LINKS,
      cartCount,
    });
  } catch (error) {
    console.error('Error getting home view:', error);
    response.status(500).send('Error loading home page');
  }
};
