"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }require('dotenv/config.js');  
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);  
var _Subcontajs = require('../../Models/Subconta.js'); var _Subcontajs2 = _interopRequireDefault(_Subcontajs);
var _Personaljs = require('../../Models/Personal.js'); var _Personaljs2 = _interopRequireDefault(_Personaljs);  
var _Enderecosjs = require('../../Models/Enderecos.js'); var _Enderecosjs2 = _interopRequireDefault(_Enderecosjs); 
  
const ASAAS_TOKEN = process.env.ASAAS_TOKEN;  
const ASAAS_API_URL = process.env.ASAAS_API_URL;  

function primeiroValorInformado(...valores) {
  return valores.find((valor) => valor !== undefined && valor !== null && valor !== '');
}

function somenteDigitos(valor) {
  return String(valor || '').replace(/\D/g, '');
}

function normalizarCnpj(valor) {
  return String(valor || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function erroComStatus(message, status = 400, details = null) {
  const error = new Error(message);
  error.status = status;
  error.details = details;
  return error;
}

function extrairMensagemAsaas(error) {
  const data = _optionalChain([error, 'access', _ => _.response, 'optionalAccess', _2 => _2.data]);

  if (!data) return error.message;

  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors
      .map((erro) => erro.description || erro.message || erro.code)
      .filter(Boolean)
      .join(' ');
  }

  if (data.message) return data.message;
  if (data.error) return data.error;

  return JSON.stringify(data);
}

function normalizarDadosSubconta(dados = {}) {
  const telefone = primeiroValorInformado(
    dados.mobilePhone,
    dados.telefone,
    dados.celular,
    dados.phone
  );

  return {
    cnpj: primeiroValorInformado(dados.cnpj),
    birthDate: primeiroValorInformado(dados.birthDate, dados.dataNascimento),
    phone: primeiroValorInformado(dados.phone, telefone),
    mobilePhone: telefone,
    incomeValue: primeiroValorInformado(dados.incomeValue, dados.rendaMensal),
    companyType: primeiroValorInformado(dados.companyType, dados.company_type, 'MEI'),
  };
}

// Dados que o personal precisa informar ao clicar em "Ativar recebimentos"
// (não existem na tabela Personal hoje).
function validarDadosObrigatorios(dados) {
  const faltando = [];  
  if (!dados.cnpj) faltando.push('cnpj');
  if (!dados.birthDate) faltando.push('birthDate/dataNascimento');
  if (!dados.mobilePhone) faltando.push('mobilePhone/telefone');
  if (!dados.incomeValue) faltando.push('incomeValue/rendaMensal');
  
  if (faltando.length) {  
    throw new Error(`Campos obrigatórios ausentes: ${faltando.join(', ')}.`);  
  }

  const cnpj = normalizarCnpj(dados.cnpj);

  if (!/^[A-Z0-9]+$/.test(cnpj)) {
    throw new Error('O campo cnpj deve conter apenas letras e números.');
  }

  if (cnpj.length !== 14) {
    throw new Error(`O campo cnpj deve conter um CNPJ com 14 caracteres alfanuméricos. Valor recebido possui ${cnpj.length} caracteres.`);
  }
}  
  
async function carregarDadosPersonal(personalId) {  
  const personal = await _Personaljs2.default.findByPk(personalId);  
  if (!personal) {  
    throw new Error('Personal não encontrado.');  
  }  
  
  const endereco = await _Enderecosjs2.default.findOne({ where: { personal_id: personalId } });  
  if (!endereco) {  
    throw new Error('Personal não possui endereço cadastrado. Conclua o cadastro antes de ativar recebimentos.');  
  }  
  
  return { personal, endereco };  
}  
  
function montarPayloadAsaas({ personal, endereco, dados }) {  
  return {  
    name: personal.nome,  
    email: personal.email,  
    cpfCnpj: normalizarCnpj(dados.cnpj),
    birthDate: dados.birthDate,
    phone: somenteDigitos(dados.phone),
    mobilePhone: somenteDigitos(dados.mobilePhone),
    address: endereco.rua,  
    addressNumber: String(endereco.numero),  
    complement: endereco.complemento || undefined,  
    province: endereco.bairro,  
    postalCode: somenteDigitos(endereco.cep),
    incomeValue: dados.incomeValue,
    companyType: dados.companyType,
  };  
}

const SubcontaService = {  

  async consultarMinhaSubconta(personalId) {
    try {
      if (!personalId) {
        throw new Error('Personal não autenticado.');
      }

      return await _Subcontajs2.default.findOne({
        where: { personal_id: personalId },
        attributes: [
          'id',
          'personal_id',
          'asaas_account_id',
          'wallet_id',
          'onboarding_url',
          'company_type',
          'status_cadastro',
          'status_aprovacao',
          'status_recebimento',
          'created_at',
          'updated_at',
        ],
      });
    } catch (error) {
      console.error('Erro ao consultar subconta:', error.message);
      throw new Error(error.message || 'Falha ao consultar subconta.');
    }
  },
  
  async criarSubconta(personalId, dados) {   
    let subconta = null;  
  
    try {
      if (!personalId) {
        throw new Error('Personal não autenticado.');  
      }  

      const dadosNormalizados = normalizarDadosSubconta(dados);
      validarDadosObrigatorios(dadosNormalizados);

      const { personal, endereco } = await carregarDadosPersonal(personalId);

      const existente = await _Subcontajs2.default.findOne({
        where: { personal_id: personalId },
      });

      if (existente && existente.status_cadastro === 'CONCLUIDO') {
        throw new Error('Esse personal já possui uma subconta cadastrada.');  
      }  
  
      if (existente) {  
        subconta = existente;  
        await subconta.update({  
          status_cadastro: 'PENDENTE',  
          company_type: dadosNormalizados.companyType,
        });
      } else {  
        subconta = await _Subcontajs2.default.create({  
          personal_id: personalId,  
          company_type: dadosNormalizados.companyType,
          status_cadastro: 'PENDENTE',  
          status_aprovacao: 'PENDENTE',  
          status_recebimento: 'PENDENTE',  
        });  
      }  
  
      const response = await _axios2.default.post(  
        `${ASAAS_API_URL}/accounts`,  
        montarPayloadAsaas({ personal, endereco, dados: dadosNormalizados }),
        {  
          headers: {  
            'Content-Type': 'application/json',  
            access_token: ASAAS_TOKEN,  
          },  
        }  
      );  
      
      console.log('Resposta Asaas /accounts:', JSON.stringify(response.data, null, 2));
      const {
        id,
        walletId,
        apiKey,
        onboardingUrl,
      } = response.data;
  
      await subconta.update({  
        asaas_account_id: id,  
        wallet_id: walletId,  
        api_key_encrypted: apiKey,  
        onboarding_url: onboardingUrl || null,  
        status_cadastro: 'CONCLUIDO',  
      });  
  
      return subconta;  
    } catch (error) {
      const mensagem = extrairMensagemAsaas(error);
      console.error('Erro ao criar subconta:', _optionalChain([error, 'access', _3 => _3.response, 'optionalAccess', _4 => _4.data]) || error.message);
  
      if (subconta) {  
        await subconta.update({ status_cadastro: 'ERRO' });  
      }  

      throw erroComStatus(
        mensagem || 'Falha ao criar subconta no Asaas.',
        _optionalChain([error, 'access', _5 => _5.response, 'optionalAccess', _6 => _6.status]) || error.status || 400,
        _optionalChain([error, 'access', _7 => _7.response, 'optionalAccess', _8 => _8.data]) || error.details || null
      );
    }  
  },  
  
  async atualizarSubconta(personalId, dados) {  
    try { 
      if (!personalId) {  
        throw new Error('Personal não autenticado.');  
      }

      const subconta = await _Subcontajs2.default.findOne({ where: { personal_id: personalId } });  
  
      if (!subconta) {  
        throw new Error('Subconta não encontrada para o personal informado.');  
      }  
  
      if (!subconta.asaas_account_id) {  
        throw new Error('Subconta não possui conta vinculada ao Asaas.');  
      }  

      const dadosNormalizados = normalizarDadosSubconta(dados);
      validarDadosObrigatorios(dadosNormalizados);
      
      const { personal, endereco } = await carregarDadosPersonal(personalId);

      await _axios2.default.put(  
        `${ASAAS_API_URL}/accounts/${subconta.asaas_account_id}`,  
        montarPayloadAsaas({ personal, endereco, dados: dadosNormalizados }),
        {  
          headers: {  
            'Content-Type': 'application/json',  
            access_token: ASAAS_TOKEN,  
          },  
        }  
      );  
      
      await subconta.update({
        company_type: dadosNormalizados.companyType,
      });

      return subconta;  
    } catch (error) {
      const mensagem = extrairMensagemAsaas(error);
      console.error('Erro ao atualizar subconta:', _optionalChain([error, 'access', _9 => _9.response, 'optionalAccess', _10 => _10.data]) || error.message);
      throw erroComStatus(
        mensagem || 'Falha ao atualizar subconta no Asaas.',
        _optionalChain([error, 'access', _11 => _11.response, 'optionalAccess', _12 => _12.status]) || error.status || 400,
        _optionalChain([error, 'access', _13 => _13.response, 'optionalAccess', _14 => _14.data]) || error.details || null
      );
    }  
  },  
};  
  
exports. default = SubcontaService;
