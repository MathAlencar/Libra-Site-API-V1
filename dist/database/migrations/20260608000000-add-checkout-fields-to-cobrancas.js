"use strict";'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Cobrancas');

    if (!table.payment_link_id) {
      await queryInterface.addColumn('Cobrancas', 'payment_link_id', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!table.checkout_url) {
      await queryInterface.addColumn('Cobrancas', 'checkout_url', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('Cobrancas');

    if (table.checkout_url) {
      await queryInterface.removeColumn('Cobrancas', 'checkout_url');
    }

    if (table.payment_link_id) {
      await queryInterface.removeColumn('Cobrancas', 'payment_link_id');
    }
  },
};
