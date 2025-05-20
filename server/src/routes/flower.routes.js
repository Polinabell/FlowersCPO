const express = require('express');
const router = express.Router();
const flowerController = require('../controllers/flower.controller');
const { authenticate, checkRole } = require('../middlewares/auth.middleware');


router.get('/flowers', flowerController.getAllFlowers);
router.get('/flowers/search/by-season', flowerController.searchBySeasons);
router.get('/flowers/search/by-country', flowerController.searchByCountry);
router.get('/flowers/search/by-variety', flowerController.searchByVariety);
router.get('/flowers/by-supplier/:supplierId', flowerController.getFlowersBySupplier);
router.get('/flowers/:id', flowerController.getFlowerById);
router.post('/flowers', authenticate, checkRole(['supplier']), flowerController.createFlower);
router.delete('/flowers/:id', authenticate, checkRole(['supplier']), flowerController.deleteFlower);

module.exports = router; 