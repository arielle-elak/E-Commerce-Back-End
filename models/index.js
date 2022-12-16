// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: "category_id",
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: "category_id",
});

// Products belongToMany Tags (through ProductTag)
// ProductTag being the intermediary third table to relate both sets of data
Product.belongsToMany(Tag, {
  through: {
    model: ProductTag,
    unique: false
  },
  as: 'product_tags'
})


// Tags belongToMany Products (through ProductTag)
// ProductTag being the intermediary third table to relate both sets of data
Tag.belongsToMany(Product, {
  through: {
    model: ProductTag,
    unique: false
  },
  as: 'product_tags'
})

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
