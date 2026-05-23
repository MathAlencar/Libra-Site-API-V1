"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _notificacaoControllers = require('../../Controllers/personal/notificacaoControllers'); var _notificacaoControllers2 = _interopRequireDefault(_notificacaoControllers);
var _personalLoginRiquered = require('../../middlewares/personalLoginRiquered'); var _personalLoginRiquered2 = _interopRequireDefault(_personalLoginRiquered);

const router = _express.Router.call(void 0, );

router.get('/', _personalLoginRiquered2.default, _notificacaoControllers2.default.index);
router.patch('/:id/lida', _personalLoginRiquered2.default, _notificacaoControllers2.default.marcarComoLida);

exports. default = router;
