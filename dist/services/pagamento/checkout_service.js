"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require('dotenv/config.js');  
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);  
  
const ASAAS_TOKEN = process.env.ASAAS_TOKEN;  
const ASAAS_API_URL = process.env.ASAAS_API_URL;  
const ASAAS_CHECKOUT_MINUTES_TO_EXPIRE = Number(process.env.ASAAS_CHECKOUT_MINUTES_TO_EXPIRE) || 1440;
const APP_URL = (process.env.URL || '').replace(/\/$/, '');
const CHECKOUT_BASE_URL =
  process.env.ASAAS_CHECKOUT_BASE_URL ||
  (ASAAS_API_URL && ASAAS_API_URL.includes('sandbox')
    ? 'https://sandbox.asaas.com'
    : 'https://asaas.com');
  
const axiosInstance = _axios2.default.create({  
  baseURL: ASAAS_API_URL,  
  headers: {  
    'Content-Type': 'application/json',  
    access_token: ASAAS_TOKEN,  
  },  
});  
  
function montarUrlCheckout(checkout) {
  if (checkout.link || checkout.url) return checkout.link || checkout.url;
  return `${CHECKOUT_BASE_URL}/checkoutSession/show?id=${checkout.id}`;
}

function montarCallback(callback = {}) {
  const baseUrl = APP_URL || 'http://localhost:3070';

  return {
    cancelUrl: callback.cancelUrl || process.env.ASAAS_CHECKOUT_CANCEL_URL || `${baseUrl}/checkout/cancel`,
    expiredUrl: callback.expiredUrl || process.env.ASAAS_CHECKOUT_EXPIRED_URL || `${baseUrl}/checkout/expired`,
    successUrl: callback.successUrl || process.env.ASAAS_CHECKOUT_SUCCESS_URL || `${baseUrl}/checkout/success`,
  };
}

/**
 * Cria um Asaas Checkout.
 *
 * Se customerData/customer nao forem informados, o aluno preenche os dados na tela do Asaas.
 */
async function criarCheckout({
  nome,
  descricao,
  valor,
  carteiraIdPersonal = null,
  percentualPersonal = 90,
  billingTypes = ['PIX', 'CREDIT_CARD'],
  chargeTypes = ['DETACHED'],
  minutesToExpire = ASAAS_CHECKOUT_MINUTES_TO_EXPIRE,
  externalReference = null,
  callback = {},
  customer = null,
  customerData = null,
}) {  
  try {  
    const body = {  
      billingTypes,
      chargeTypes,
      minutesToExpire,
      callback: montarCallback(callback),
      items: [
        {
          name: nome,
          description: descricao || nome,
          quantity: 1,
          value: Number(valor),
        },
      ],
    };  

    if (externalReference) {
      body.externalReference = String(externalReference).slice(0, 200);
    }

    if (customer) {
      body.customer = customer;
    } else if (customerData) {
      body.customerData = customerData;
    }

    if (carteiraIdPersonal) {  
      body.splits = [
        {  
          walletId: carteiraIdPersonal,  
          percentageValue: percentualPersonal,  
        },  
      ];  
    }  
  
    const response = await axiosInstance.post('/checkouts', body);  
    return {
      ...response.data,
      checkoutUrl: montarUrlCheckout(response.data),
    };
  } catch (error) {  
    console.error(  
      'Erro ao criar checkout:',  
      error.response ? error.response.data : error.message,  
    );  
    throw error;  
  }  
}  
  
/**  
 * Consulta um Checkout existente pelo ID.
 */  
async function consultarCheckout(checkoutId) {  
  try {  
    const response = await axiosInstance.get(`/checkouts/${checkoutId}`);  
    return {
      ...response.data,
      checkoutUrl: montarUrlCheckout(response.data),
    };
  } catch (error) {  
    console.error(  
      'Erro ao consultar checkout:',  
      error.response ? error.response.data : error.message,  
    );  
    throw error;  
  }  
}  
  
exports. default = {  
  criarCheckout,  
  consultarCheckout,  
};
