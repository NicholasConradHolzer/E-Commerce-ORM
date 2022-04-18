const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


router.get('/', (req, res) => {
  Product.findAll ({
    attributes: [
      'id',
      'product_name',
      'price',
      'stock',
      'category_id'
    ],

    include: [
        {model: Category,
        attributes:['id','category_name']},
        
        {model: Tag,
        attributes:['id', 'tag']}
      ]
  })

  .then(productData =>{ if (!productData) {
    res.status(404).json({ message: "No Category matches this description"});
    return;
  }res.json(productData)})

  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});


router.get('/:id', (req, res) => {
  Product.findOne(req.params.id, {attributes:['id', 'product_name','price','stock','category_id'],
    include: [{ model: Category,
    attributes: ['id', 'category_name']}, { model: Tag,
    attirbutes: ['id', 'tag_name'] }]
  }).then((productData) => {
    
    res.json(productData);
  })
  .catch((err) => {
    res.json(err);
  });
});


router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    
    .then((productTagIds) => res.status(200).json(productTagIds))
    
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      return ProductTag.findAll({ 
        where: { product_id: req.params.id } 
      });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      const productTagRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id );

      return Promise.all([
        ProductTag.destroy({ where: { id: productTagRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updateProductTags) => res.json(updateProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((deletedProduct) => {
      res.json(deletedProduct);
    })
    .catch((err) => {
      res.json(err);
    });
});
  

module.exports = router;
