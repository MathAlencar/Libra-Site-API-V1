"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');  
var _checkoutControllersjs = require('../../Controllers/pagamento/checkoutControllers.js'); var _checkoutControllersjs2 = _interopRequireDefault(_checkoutControllersjs);  
var _alunoLoginRiqueredjs = require('../../middlewares/alunoLoginRiquered.js'); var _alunoLoginRiqueredjs2 = _interopRequireDefault(_alunoLoginRiqueredjs);
  
const router = new (0, _express.Router)();  
router.post('/', _alunoLoginRiqueredjs2.default, _checkoutControllersjs2.default.store);  
router.get('/:id', _alunoLoginRiqueredjs2.default, _checkoutControllersjs2.default.show);
  
exports. default = router;
