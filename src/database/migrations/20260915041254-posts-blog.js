/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts_blog', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      categoria: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      },
      resumo: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      subtitulo: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      },
      leitura: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      },
      corpoTexto: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      capaUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      publicado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      publicadoEm: {
        type: Sequelize.DATE,
        allowNull: false,
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('posts_blog');
  },
};
