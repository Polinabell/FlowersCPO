const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');
const { authJwt } = require('../middlewares');

router.use(authJwt.verifyToken);
router.post('/', requestController.createRequest);
router.get('/all', [authJwt.isAdmin], requestController.getAllRequests);
router.get('/my', requestController.getUserRequests);
router.get('/:id', requestController.getRequestById);
router.patch('/:id/status', requestController.updateRequestStatus);
router.delete('/:id', requestController.deleteRequest);

module.exports = router; 