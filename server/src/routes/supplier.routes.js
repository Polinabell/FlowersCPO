const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');

router.get('/suppliers', supplierController.getAllSuppliers);
router.get('/suppliers/:id', supplierController.getSupplierById);
router.get('/suppliers/:id/flowers', supplierController.getSupplierFlowers);

module.exports = router; 