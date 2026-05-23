"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _enderecosControllers = require('../../Controllers/enderecos/enderecosControllers'); var _enderecosControllers2 = _interopRequireDefault(_enderecosControllers);
var _alunoLoginRiquered = require('../../middlewares/alunoLoginRiquered'); var _alunoLoginRiquered2 = _interopRequireDefault(_alunoLoginRiquered);
var _personalLoginRiquered = require('../../middlewares/personalLoginRiquered'); var _personalLoginRiquered2 = _interopRequireDefault(_personalLoginRiquered);

const routes = _express.Router.call(void 0, );

routes.post('/aluno', _alunoLoginRiquered2.default, (req, res) => _enderecosControllers2.default.storeAluno(req, res));
routes.post('/personal', _personalLoginRiquered2.default, (req, res) => _enderecosControllers2.default.storePersonal(req, res));
routes.post('/', _enderecosControllers2.default.store);
routes.get('/:tipo/:id', _enderecosControllers2.default.showByPerfil);
routes.get('/:id', _enderecosControllers2.default.show);
routes.put('/:id', _enderecosControllers2.default.update);
routes.delete('/:id', _enderecosControllers2.default.delete);

exports. default = routes;
