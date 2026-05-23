"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _notificacao_servicejs = require('../../services/notificacao/notificacao_service.js'); var _notificacao_servicejs2 = _interopRequireDefault(_notificacao_servicejs);

class NotificacaoControllers {
  async index(req, res) {
    try {
      const resultado = await _notificacao_servicejs2.default.listarDoPersonal(
        req.userID,
        req.query,
      );

      return res.status(200).json(resultado);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _ => _.errors, 'optionalAccess', _2 => _2.map, 'call', _3 => _3((err) => err.message)]) || [e.message],
      });
    }
  }

  async marcarComoLida(req, res) {
    try {
      const notificacao = await _notificacao_servicejs2.default.marcarComoLidaDoPersonal(
        req.userID,
        req.params.id,
      );

      if (!notificacao) {
        return res.status(404).json({
          errors: ['Notificação não encontrada'],
        });
      }

      return res.status(200).json(notificacao);
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _4 => _4.errors, 'optionalAccess', _5 => _5.map, 'call', _6 => _6((err) => err.message)]) || [e.message],
      });
    }
  }
}

exports. default = new NotificacaoControllers();
