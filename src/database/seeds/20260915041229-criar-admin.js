const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'administrador',
      [{
        nome: 'Administrador Libra',
        email: 'admin@libracredito.com.br',
        password_hash: await bcrypt.hash('LibraAdmin@123', 8),
        created_at: new Date(),
        updated_at: new Date(),
      }],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('administrador', {
      email: 'admin@libracredito.com.br',
    });
  },
};
