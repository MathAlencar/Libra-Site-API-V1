"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require('dotenv/config.js');  
var _webhook_servicejs = require('../../services/pagamento/webhook_service.js'); var _webhook_servicejs2 = _interopRequireDefault(_webhook_servicejs);  
  
const TOKENS = {  
  checkouts: process.env.ASAAS_WEBHOOK_TOKEN_CHECKOUTS,
  accountStatus: process.env.ASAAS_WEBHOOK_TOKEN_ACCOUNT_STATUS,  
  transfers: process.env.ASAAS_WEBHOOK_TOKEN_TRANSFERS,  
};  
  
function validarToken(req, tokenEsperado) {  
  if (!tokenEsperado) return false;  
  const tokenRecebido = req.headers['asaas-access-token'];  
  return tokenRecebido === tokenEsperado;  
}  
  
class WebhookControllers {  

  async checkouts(req, res) {
    try {
      if (!validarToken(req, TOKENS.checkouts)) {
        console.error('Webhook checkouts: token inválido.');
        return res.status(401).json({ error: 'Token inválido.' });
      }

      console.log('Webhook checkouts recebido:', JSON.stringify(req.body));
      await _webhook_servicejs2.default.processarCheckout(req.body);

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error('Erro webhook checkouts:', error.message);
      return res.status(200).json({ ok: true });
    }
  }
  
  async accountStatus(req, res) {  
    try {  
      if (!validarToken(req, TOKENS.accountStatus)) {  
        console.error('Webhook account-status: token inválido.');  
        return res.status(401).json({ error: 'Token inválido.' });  
      }  
  
      console.log('Webhook account-status recebido:', JSON.stringify(req.body));  
      await _webhook_servicejs2.default.processarStatusConta(req.body);  
  
      return res.status(200).json({ ok: true });  
    } catch (error) {  
      console.error('Erro webhook account-status:', error.message);  
      return res.status(200).json({ ok: true });  
    }  
  }  
  
  async transfers(req, res) {  
    try {  
      if (!validarToken(req, TOKENS.transfers)) {  
        console.error('Webhook transfers: token inválido.');  
        return res.status(401).json({ error: 'Token inválido.' });  
      }  
  
      console.log('Webhook transfers recebido:', JSON.stringify(req.body));  
      await _webhook_servicejs2.default.processarTransferencia(req.body);  
  
      return res.status(200).json({ ok: true });  
    } catch (error) {  
      console.error('Erro webhook transfers:', error.message);  
      return res.status(200).json({ ok: true });  
    }  
  }  
}  
  
exports. default = new WebhookControllers();
