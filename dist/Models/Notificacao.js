"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

 class Notificacao extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      destinatario_id: {
        type: _sequelize2.default.INTEGER,
        allowNull: false,
      },
      tipo_destinatario: {
        type: _sequelize2.default.ENUM('aluno', 'personal', 'admin'),
        allowNull: false,
      },
      tipo: {
        type: _sequelize2.default.STRING(50),
        allowNull: false,
      },
      titulo: {
        type: _sequelize2.default.STRING(120),
        allowNull: false,
      },
      mensagem: {
        type: _sequelize2.default.TEXT,
        allowNull: false,
      },
      entidade_tipo: {
        type: _sequelize2.default.STRING(50),
        allowNull: true,
      },
      entidade_id: {
        type: _sequelize2.default.INTEGER,
        allowNull: true,
      },
      dados: {
        type: _sequelize2.default.JSON,
        allowNull: true,
      },
      lida_em: {
        type: _sequelize2.default.DATE,
        allowNull: true,
      },
    }, {
      sequelize,
      tableName: 'notificacoes',
    });

    return this;
  }
} exports.default = Notificacao;
