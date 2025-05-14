const { getDb } = require('../database');
const Product = require('./Product');

class Cart {
  constructor() {}

  // We'll use a singleton cart with a fixed ID for simplicity
  static CART_ID = 'main-cart';

  static async getCart() {
    try {
      const db = getDb();
      let cart = await db.collection('carts').findOne({ cartId: this.CART_ID });
      
      if (!cart) {
        // Initialize cart if it doesn't exist
        cart = { cartId: this.CART_ID, items: [] };
        await db.collection('carts').insertOne(cart);
      }
      
      return cart;
    } catch (error) {
      console.error('Error getting cart:', error);
      return { cartId: this.CART_ID, items: [] };
    }
  }

  static async add(productName) {
    try {
      const db = getDb();
      const product = await Product.findByName(productName);

      if (!product) {
        throw new Error(`Product '${productName}' not found.`);
      }

      const cart = await this.getCart();
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.name === productName
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        cart.items[existingItemIndex].quantity += 1;
      } else {
        // Add new item
        cart.items.push({ product, quantity: 1 });
      }

      // Update cart in database
      await db.collection('carts').updateOne(
        { cartId: this.CART_ID },
        { $set: { items: cart.items } }
      );

      return cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  static async getItems() {
    try {
      const cart = await this.getCart();
      return cart.items || [];
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  static async getProductsQuantity() {
    try {
      const items = await this.getItems();
      
      if (!items.length) {
        return 0;
      }

      return items.reduce((total, item) => {
        return total + item.quantity;
      }, 0);
    } catch (error) {
      console.error('Error getting products quantity:', error);
      return 0;
    }
  }

  static async getTotalPrice() {
    try {
      const items = await this.getItems();
      
      return items.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);
    } catch (error) {
      console.error('Error calculating total price:', error);
      return 0;
    }
  }

  static async clearCart() {
    try {
      const db = getDb();
      await db.collection('carts').updateOne(
        { cartId: this.CART_ID },
        { $set: { items: [] } }
      );
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
}

module.exports = Cart;
