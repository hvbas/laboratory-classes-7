const Product = require("../models/Product");
const Cart = require("../models/Cart");

const { STATUS_CODE } = require("../constants/statusCode");

exports.addProductToCart = async (request, response) => {
  try {
    // Create a new product instance and save it
    const product = new Product(
      request.body.name,
      request.body.description,
      request.body.price
    );
    await product.save();
    
    // Add the product to the cart
    await Cart.add(request.body.name);

    response.status(STATUS_CODE.FOUND).redirect("/products/new");
  } catch (error) {
    console.error('Error adding product to cart:', error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send('Error adding product');
  }
};

exports.getProductsCount = async () => {
  try {
    return await Cart.getProductsQuantity();
  } catch (error) {
    console.error('Error getting products count:', error);
    return 0;
  }
};
