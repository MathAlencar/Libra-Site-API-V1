"use strict";/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notificacoes', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      destinatario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tipo_destinatario: {
        type: Sequelize.ENUM('aluno', 'personal', 'admin'),
        allowNull: false,
      },
      tipo: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      titulo: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      mensagem: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      entidade_tipo: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      entidade_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      dados: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      lida_em: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('notificacoes', [
      'tipo_destinatario',
      'destinatario_id',
      'lida_em',
      'created_at',
    ], {
      name: 'notificacoes_destinatario_lida_created_at_idx',
    });

    await queryInterface.addIndex('notificacoes', ['tipo', 'created_at'], {
      name: 'notificacoes_tipo_created_at_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notificacoes');
  },
};
