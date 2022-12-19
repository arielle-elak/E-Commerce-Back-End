const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// Find All Tags
router.get('/', (req, res) => {
  Tag.findAll({
    // Include the associated detailed product info, linked through ProductTag
    include: [
      {
        model: Product,
        through: ProductTag,
      },
    ],
  })
    .then((allTags) => res.status(200).json(allTags))
    .catch((err) => res.status(500).json(err));
});

// Find a Single Tag
router.get('/:id', (req, res) => {
  Tag.findOne({
    // through the URL request id parameter
    where: {
      id: req.params.id,
    },
    // Include all associated product for single tag
    include: [
      {
        model: Product,
        through: ProductTag,
      },
    ],
  })
    .then((oneTag) => res.status(200).json(oneTag))
    .catch((err) => res.status(404).json(err));
});

// Create a New Tag
router.post('/', (req, res) => {
  Tag.create(req.body)
    /** Req Body:
     * {
     *    "tag_name": "2022 Promotion"
     * }
     *
     */
    .then((newTag) => res.status(200).json(newTag))
    .catch((err) => res.status(404).json(err));
});

// Update a Tag
router.put('/:id', (req, res) => {
  // update a tag by its `id` value from the URL
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
    /** Req body will look like this:
     * {
     *    "tag_name": "2023 Promotion"
     * }
     */
  })
    .then((updatedTag) => res.status(200).json(updatedTag))
    .catch((err) => res.status(400).json(err));
});

// Delete a Tag
router.delete('/:id', (req, res) => {
  Tag.destroy({
    // Find tag based on URL id parameter
    where: {
      id: req.params.id,
    },
  })
    .then((deletedTag) => res.status(200).json(deletedTag))
    .catch((err) => res.status(404).json(err));
});

module.exports = router;
