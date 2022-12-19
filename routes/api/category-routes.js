const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// Find All Categories
router.get('/', (req, res) => {
  // find all categories
  Category.findAll({
    // be sure to include its associated Products
    include: [Product],
  })
    // Show category results
    .then((categoryresults) => res.json(categoryresults))
    .catch((err) => res.status(500).json(err));
});

// Find Single Category
router.get('/:id', (req, res) => {
  // find one category by its `id` value
  Category.findOne({
    // be sure to include its associated Products
    include: [Product],
  })
    // Show single category
    .then((category) => res.json(category))
    .catch((err) => res.status(500).json(err));
});

// Create New Category
// Appropriate need to be updated with new category once created
router.post('/', (req, res) => {
  // Create a new category based on passed req body
  /** Req body will look like this:
   * {
   *    "category_name": "Sports Balls"
   * }
   */
  Category.create(req.body)
    .then((newCategory) => res.status(200).json(newCategory))
    .catch((err) => res.status(400).json(err));
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
