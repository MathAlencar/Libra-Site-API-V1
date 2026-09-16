/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('leads', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      tipo: {
        type: Sequelize.ENUM('simulacao', 'parceiro'),
        allowNull: false,
      },
      quando: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('novo', 'lido'),
        allowNull: false,
        defaultValue: 'novo',
      },
      dados: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      resultado: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      origem: {
        type: Sequelize.STRING,
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('leads');
  },
};
