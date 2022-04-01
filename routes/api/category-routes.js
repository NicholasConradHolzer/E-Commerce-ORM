const router = require('express').Router();
// const res = require('express/lib/response');
const { Category, Product } = require('../../models');


router.get('/', (req, res) => {
  Category.findAll({
  include: [{ model: Product}]
})
    .then(netProd => res.json(netProd))

    .catch(err=> {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => { 
  Category.findByPk ({
    include: [{ model: Product}],
    where: { 
      id: req.params.id
    }
  })

  .then(findProd => res.json(findProd))

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
    Category.update(req.body, {
      individualHooks: true,

      where: {
        id: req.params.id
      }
  })

    .then(udProd => {
      if(!udProd[0]) {
        res.status(404).json({ message: 'No Category found with this ID'});
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
      res.json(delProd);
    })

    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;