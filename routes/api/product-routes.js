const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Get All Products
router.get("/", async (req, res) => {
  try {
    // Find all products, including the associated Category info, and the associated tags from product tag
    const allProducts = await Product.findAll({
      include: [
        Category,
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    });
    console.log("Finding All Products");
    // Confirm 200 response for request
    res.status(200).json(allProducts);
    // If error response
  } catch (err) {
    console.log(err);
    // Show the specific error message
    res.status(400).json(err);
  }
});


// Get One Product
router.get("/:id", async (req, res) => {
  try {
    // Find one product, including the associated Category info, and the associated tags from product tag
    const oneProduct = await Product.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        Category,
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    });
    console.log("Finding One Product");
    // Confirm 200 response for request
    res.status(200).json(oneProduct);
    // If error response
  } catch (err) {
    console.log(err);
    // Show the specific error message
    res.status(400).json(err);
  }
});


// Create New Product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      // Added logic to make sure tag ids actually are there (length >0)
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // If there are no product tags (length <0 respond normally without tags)
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// Update a Product
router.put('/:id', (req, res) => {
  // Use Requester Body to Update the fields for desired id
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});


// Delete One Product
router.delete("/:id", async (req, res) => {
  try {
    // Find one product by requested tag from URL
    const deleteProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    console.log("Deleting One Product");
    // Confirm 200 response for request
    res.status(200).json(deleteProduct);
    // If error response
  } catch (err) {
    console.log(err);
    // Show the specific error message
    res.status(400).json(err);
  }
});

module.exports = router;
