const Product = require("../models/Product");

const { MENU_LINKS } = require("../constants/navigation");
const { STATUS_CODE } = require("../constants/statusCode");

const cartController = require("./cartController");

exports.getProductsView = async (request, response) => {
  try {
    const cartCount = await cartController.getProductsCount();
    const products = await Product.getAll();

    response.render("products.ejs", {
      headTitle: "Shop - Products",
      path: "/",
      menuLinks: MENU_LINKS,
      activeLinkPath: "/products",
      products,
      cartCount,
    });
  } catch (error) {
    console.error('Error getting products view:', error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send('Error loading products');
  }
};

exports.getAddProductView = async (request, response) => {
  try {
    const cartCount = await cartController.getProductsCount();

    response.render("add-product.ejs", {
      headTitle: "Shop - Add product",
      path: "/add",
      menuLinks: MENU_LINKS,
      activeLinkPath: "/products/add",
      cartCount,
    });
  } catch (error) {
    console.error('Error getting add product view:', error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send('Error loading add product page');
  }
};

exports.getNewProductView = async (request, response) => {
  try {
    const cartCount = await cartController.getProductsCount();
    const newestProduct = await Product.getLast();

    response.render("new-product.ejs", {
      headTitle: "Shop - New product",
      path: "/new",
      activeLinkPath: "/products/new",
      menuLinks: MENU_LINKS,
      newestProduct,
      cartCount,
    });
  } catch (error) {
    console.error('Error getting new product view:', error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send('Error loading new product page');
  }
};

exports.getProductView = async (request, response) => {
  try {
    const cartCount = await cartController.getProductsCount();
    const name = request.params.name;

    const product = await Product.findByName(name);

    if (!product) {
      return response.status(STATUS_CODE.NOT_FOUND).render('404', {
        headTitle: "404 - Product Not Found",
        menuLinks: MENU_LINKS,
        activeLinkPath: "",
        cartCount,
      });
    }

    response.render("product.ejs", {
      headTitle: "Shop - Product",
      path: `/products/${name}`,
      activeLinkPath: `/products/${name}`,
      menuLinks: MENU_LINKS,
      product,
      cartCount,
    });
  } catch (error) {
    console.error('Error getting product view:', error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send('Error loading product');
  }
};

exports.deleteProduct = async (request, response) => {
  try {
    const name = request.params.name;
    const result = await Product.deleteByName(name);

    if (result) {
      response.status(STATUS_CODE.OK).json({ success: true });
    } else {
      response.status(STATUS_CODE.NOT_FOUND).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error deleting product' });
  }
};
