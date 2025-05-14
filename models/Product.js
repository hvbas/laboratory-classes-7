const { getDb } = require('../database');
const { ObjectId } = require('mongodb');

class Product {
  constructor(name, description, price, id) {
    this.name = name;
    this.description = description;
    this.price = price;
    this._id = id ? new ObjectId(id) : null;
  }

  static async getAll() {
    try {
      const db = getDb();
      const products = await db.collection('products').find().toArray();
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async save() {
    try {
      const db = getDb();
      if (this._id) {
        // Update existing product
        await db.collection('products').updateOne(
          { _id: this._id },
          { $set: { name: this.name, description: this.description, price: this.price } }
        );
      } else {
        // Insert new product
        const result = await db.collection('products').insertOne(this);
        this._id = result.insertedId;
      }
      return this;
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }

  static async findByName(name) {
    try {
      const db = getDb();
      const product = await db.collection('products').findOne({ name: name });
      return product;
    } catch (error) {
      console.error('Error finding product by name:', error);
      return null;
    }
  }

  static async deleteByName(name) {
    try {
      const db = getDb();
      const result = await db.collection('products').deleteOne({ name: name });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  static async getLast() {
    try {
      const db = getDb();
      const products = await db.collection('products')
        .find()
        .sort({ _id: -1 })
        .limit(1)
        .toArray();
      
      return products.length > 0 ? products[0] : null;
    } catch (error) {
      console.error('Error getting last product:', error);
      return null;
    }
  }
}

module.exports = Product;
