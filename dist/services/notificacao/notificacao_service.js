"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize');
var _Alunosjs = require('../../Models/Alunos.js'); var _Alunosjs2 = _interopRequireDefault(_Alunosjs);
var _Notificacaojs = require('../../Models/Notificacao.js'); var _Notificacaojs2 = _interopRequireDefault(_Notificacaojs);
var _PlanosPersonaljs = require('../../Models/PlanosPersonal.js'); var _PlanosPersonaljs2 = _interopRequireDefault(_PlanosPersonaljs);

const TIPOS_NOTIFICACAO = {
  PAGAMENTO_APROVADO: 'PAGAMENTO_APROVADO',
};

function normalizarValor(valor) {
  if (valor === null || valor === undefined) return null;
  return Number(valor);
}

const NotificacaoService = {
  async listarDoPersonal(personalId, filtros = {}) {
    const page = Math.max(Number(filtros.page) || 1, 1);
    const limit = Math.min(Math.max(Number(filtros.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const where = {
      destinatario_id: personalId,
      tipo_destinatario: 'personal',
    };

    if (filtros.lida === 'true') {
      where.lida_em = { [_sequelize.Op.ne]: null };
    } else if (filtros.lida === 'false') {
      where.lida_em = null;
    }

    const { rows, count } = await _Notificacaojs2.default.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return {
      notificacoes: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  },

  async marcarComoLidaDoPersonal(personalId, notificacaoId) {
    const notificacao = await _Notificacaojs2.default.findOne({
      where: {
        id: notificacaoId,
        destinatario_id: personalId,
        tipo_destinatario: 'personal',
      },
    });

    if (!notificacao) return null;

    if (!notificacao.lida_em) {
      await notificacao.update({ lida_em: new Date() });
    }

    return notificacao;
  },

  async criarPagamentoAprovado(cobranca) {
    const [aluno, plano] = await Promise.all([
      _Alunosjs2.default.findByPk(cobranca.aluno_id),
      _PlanosPersonaljs2.default.findByPk(cobranca.plano_id),
    ]);

    if (!aluno || !plano) {
      console.warn(
        `Nao foi possivel criar notificacao de pagamento. aluno=${cobranca.aluno_id}, plano=${cobranca.plano_id}`,
      );
      return null;
    }

    return _Notificacaojs2.default.create({
      destinatario_id: plano.personal_id,
      tipo_destinatario: 'personal',
      tipo: TIPOS_NOTIFICACAO.PAGAMENTO_APROVADO,
      titulo: 'Pagamento aprovado',
      mensagem:
        `O aluno ${aluno.nome} teve o pagamento aprovado `
        + `para o plano ${plano.tipo_plano}.`,
      entidade_tipo: 'checkout',
      entidade_id: cobranca.id,
      dados: {
        aluno_id: aluno.id,
        aluno_nome: aluno.nome,
        plano_id: plano.id,
        plano_tipo: plano.tipo_plano,
        cobranca_id: cobranca.id,
        checkout_id: cobranca.payment_link_id,
        valor: normalizarValor(cobranca.value),
      },
    });
  },
};

exports. default = NotificacaoService;
