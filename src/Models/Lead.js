import Sequelize, { Model } from 'sequelize';

export default class Lead extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
    }, {
      sequelize,
      tableName: 'leads',
    });

    return this;
  }

  toLead() {
    const lead = this.toJSON();
    const dados = typeof lead.dados === 'string' ? JSON.parse(lead.dados) : lead.dados;
    const resultado = lead.resultado == null
      ? undefined
      : (typeof lead.resultado === 'string' ? JSON.parse(lead.resultado) : lead.resultado);

    return {
      id: lead.id,
      tipo: lead.tipo,
      quando: lead.quando ? new Date(lead.quando).toISOString() : null,
      status: lead.status,
      dados,
      ...(resultado !== undefined ? { resultado } : {}),
      ...(lead.origem ? { origem: lead.origem } : {}),
    };
  }
}
