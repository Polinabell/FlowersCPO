const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller.controller');
const { authenticate, checkRole } = require('../middlewares/auth.middleware');


router.get('/sellers', sellerController.getAllSellers);
router.get('/sellers/top/expensive', sellerController.getTopExpensiveSellers);
router.get('/sellers/matching-suppliers', sellerController.getMatchingSuppliers);
router.get('/sellers/:id', sellerController.getSellerById);
router.get('/sellers/:id/flowers', sellerController.getSellerFlowers);
router.post('/sellers/flowers', authenticate, checkRole(['seller']), sellerController.addFlowerToSeller);
router.delete('/sellers/flowers/:flowerId', authenticate, checkRole(['seller']), sellerController.removeFlowerFromSeller);

module.exports = router; 