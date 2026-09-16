import Sequelize, { Model } from 'sequelize';

export default class Midia extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.ENUM('image', 'video'),
        allowNull: false,
      },
      alt: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    }, {
      sequelize,
      tableName: 'midias',
    });

    return this;
  }
}
