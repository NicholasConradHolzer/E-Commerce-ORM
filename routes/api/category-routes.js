const router = require('express').Router();
const { Category, Product } = require('../../models');


router.get('/', (req, res) => {
  Category.findAll({
    attributes: ['id', 'category_name'],
  include: [ {model: Product,
    attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],}
  ]
})
    .then((netProd) => {
      if(!netProd) {res.status(404).json({ 
        message: 'No Caegories Match this Description'});
    return;
  }
     res.json(netProd)
})
    .catch(err=> {
      console.log(err);
      res.status(404).json(err);
    });
});

router.get('/:id', (req, res) => { 
  Category.findOne ({
    where: { 
      id: req.params.id
    },
    attributes: ['id', 'category_name'],
    include: [{ model: Product,
    attributes: ['id', 'product_name', 'price', 'stock', 'category_id']}],
    
  })

  .then((findProd) => {
    if(!findProd) {res.status(404).json({ 
      message: 'No Products Match this Description'});
  return;
} res.json(findProd)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err);
  })
});

router.post('/', (req, res) => {
  Category.create({
    category_name: req.body.category_name
  })

    .then(makeProd => res.json(makeProd))

    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
    Category.update(
      req.body, {
      individualHooks: true,

      where: {
        id: req.params.id
      },
      category_name: req.body.category_name
  })

    .then(udProd => {
      if(!udProd[0]) {
        res.status(404).json({ message: 'No Category matches this description'});
        return;
    }
    res.json(udProd);
  })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((delProd) => {
      if (!delProd) {
        res.status(404).json({ message: "No Category matches this description"});
        return;
      }
      res.json(delProd);
    })

    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;