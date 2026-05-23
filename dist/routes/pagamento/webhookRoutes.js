"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');  
var _webhookControllersjs = require('../../Controllers/pagamento/webhookControllers.js'); var _webhookControllersjs2 = _interopRequireDefault(_webhookControllersjs);  
  
const router = new (0, _express.Router)();  
  
router.post('/asaas/checkouts', _webhookControllersjs2.default.checkouts);
router.post('/asaas/account-status', _webhookControllersjs2.default.accountStatus);  
router.post('/asaas/transfers', _webhookControllersjs2.default.transfers);  
  
exports. default = router;
