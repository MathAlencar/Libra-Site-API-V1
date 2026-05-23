"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _checkout_servicejs = require('../../services/pagamento/checkout_service.js'); var _checkout_servicejs2 = _interopRequireDefault(_checkout_servicejs);  
var _Subcontajs = require('../../Models/Subconta.js'); var _Subcontajs2 = _interopRequireDefault(_Subcontajs);  
var _Alunosjs = require('../../Models/Alunos.js'); var _Alunosjs2 = _interopRequireDefault(_Alunosjs);  
var _PlanosPersonaljs = require('../../Models/PlanosPersonal.js'); var _PlanosPersonaljs2 = _interopRequireDefault(_PlanosPersonaljs);  
var _Cobrancajs = require('../../Models/Cobranca.js'); var _Cobrancajs2 = _interopRequireDefault(_Cobrancajs);  

function somenteDigitos(valor) {
  return String(valor || '').replace(/\D/g, '');
}

function montarCustomerDataAluno(aluno) {
  const customerData = {
    name: aluno.nome,
    email: aluno.email,
    cpfCnpj: somenteDigitos(aluno.cpf_cnpj),
    phone: somenteDigitos(aluno.celular),
  };

  return Object.fromEntries(
    Object.entries(customerData).filter(([, value]) => value),
  );
}
  
class CheckoutControllers {  
  async store(req, res) {  
    try {  
      const {
        planoId,
        billingTypes,
        chargeTypes,
        callback,
        customer,
        customerData,
        usarDadosAluno = false,
      } = req.body;
      const alunoId = req.userID;
  
      if (!planoId) {  
        return res.status(400).json({  
          errors: ['Campo obrigatório: planoId.'],  
        });  
      }  
  
      // 1. Buscar aluno (validar existência)  
      const aluno = await _Alunosjs2.default.findByPk(alunoId);  
      if (!aluno) {  
        return res.status(404).json({  
          errors: ['Aluno não encontrado.'],  
        });  
      }  
  
      // 2. Buscar plano (obter valor e personal_id)  
      const plano = await _PlanosPersonaljs2.default.findByPk(planoId);  
      if (!plano) {  
        return res.status(404).json({  
          errors: ['Plano não encontrado.'],  
        });  
      }  
  
      // 3. Buscar subconta do personal (obter carteira_id para split)  
      const subconta = await _Subcontajs2.default.findOne({  
        where: { personal_id: plano.personal_id },  
      });  
  
      if (!subconta || !subconta.wallet_id) {  
        return res.status(400).json({  
          errors: ['Personal não possui subconta/carteira configurada no Asaas.'],  
        });  
      }  
  
      // 4. Criar checkout no Asaas
      const nomeCheckout = `${plano.tipo_plano} - Plano #${plano.id}`;  
      const checkoutCustomerData =
        customerData || (usarDadosAluno ? montarCustomerDataAluno(aluno) : null);
      const checkout = await _checkout_servicejs2.default.criarCheckout({
        nome: nomeCheckout,
        descricao: `Contratacao do plano ${plano.tipo_plano}`,
        valor: plano.valor,
        carteiraIdPersonal: subconta.wallet_id,
        percentualPersonal: 90,
        billingTypes,
        chargeTypes,
        externalReference: `aluno:${alunoId}|plano:${planoId}`,
        callback,
        customer,
        customerData: customer ? null : checkoutCustomerData,
      });
  
      // 5. Salvar registro na tabela Cobrancas  
      const cobranca = await _Cobrancajs2.default.create({  
        aluno_id: alunoId,  
        plano_id: planoId,  
        payment_link_id: checkout.id,  
        checkout_url: checkout.checkoutUrl,  
        status: 'PENDING',  
        value: plano.valor,  
      });  
  
      // 6. Retornar URL do checkout ao frontend  
      return res.status(201).json({  
        cobranca_id: cobranca.id,  
        checkout_id: checkout.id,
        checkout_url: checkout.checkoutUrl,
        payment_link_id: checkout.id,
        status: checkout.status,
      });  
    } catch (e) {  
      console.error('Erro ao criar checkout:', e);  
  
      return res.status(400).json({  
        errors:  
          _optionalChain([e, 'access', _ => _.response, 'optionalAccess', _2 => _2.data, 'optionalAccess', _3 => _3.errors, 'optionalAccess', _4 => _4.map, 'call', _5 => _5((err) => err.description)]) ||  
          [e.message],  
      });  
    }  
  }  

  async show(req, res) {
    try {
      const { id } = req.params;
      const checkout = await _checkout_servicejs2.default.consultarCheckout(id);

      return res.status(200).json(checkout);
    } catch (e) {
      return res.status(400).json({
        errors:
          _optionalChain([e, 'access', _6 => _6.response, 'optionalAccess', _7 => _7.data, 'optionalAccess', _8 => _8.errors, 'optionalAccess', _9 => _9.map, 'call', _10 => _10((err) => err.description)]) ||
          [e.message],
      });
    }
  }
}  
  
exports. default = new CheckoutControllers();
