const router = require('express').Router();
const { Tag, Product } = require('../../models');


router.get('/', (req, res) => {
  Tag.findAll({
    include: [{ model: Product }]
  }).then((tagData) => {
    res.json(tagData);
  });
});

router.get('/:id', (req, res) => {
  Tag.findByPk(req.params.id, {
    include: [{ model: Product }]
  }).then((tagData) => {
    res.json(tagData);
  })
  .catch((err) => {
    res.json(err);
  });
});

router.post('/', (req, res) => {
  Tag.create(req.body)
  .then((newTag) => {
    res.json(newTag);
  });
});

router.put('/:id', (req, res) => {
  Tag.update(
    {
      tag_name: req.body.tag_name
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then((updatedTag) => {
      res.json(updatedTag);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((deletedTag) => {
      res.json(deletedTag);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;