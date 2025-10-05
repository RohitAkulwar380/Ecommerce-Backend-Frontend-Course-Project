const router = require('express').Router();
const {createProduct, updateProduct, deleteProduct, getProduct, getProducts} = require ('../controller/product.controller');

const {protect, authorize, ROLES} = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:id', getProduct);

router.post('/', protect, authorize(ROLES.ADMIN), createProduct);
router.put('/:id', protect, authorize(ROLES.ADMIN), updateProduct);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteProduct);

module.exports = router;
