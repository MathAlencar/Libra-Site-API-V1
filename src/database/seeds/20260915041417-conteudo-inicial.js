const conteudo = require('../../data/siteContentInicial.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const agora = new Date(conteudo.atualizadoEm || Date.now());

    await queryInterface.bulkInsert(
      'conteudo_site',
      [{
        conteudo: JSON.stringify(conteudo),
        versao: conteudo.versao || 1,
        atualizado_em: agora,
        created_at: agora,
        updated_at: agora,
      }],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('conteudo_site', null, {});
  },
};
