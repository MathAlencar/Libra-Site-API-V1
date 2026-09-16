import Sequelize, { Model } from 'sequelize';

export default class ConteudoSite extends Model {
  static init(sequelize) {
    super.init({
      conteudo: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      versao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'conteudo_site',
    });

    return this;
  }

  toSiteContent() {
    const raw = typeof this.conteudo === 'string'
      ? JSON.parse(this.conteudo)
      : this.conteudo;

    return {
      ...raw,
      versao: this.versao,
      atualizadoEm: this.atualizado_em
        ? new Date(this.atualizado_em).toISOString()
        : raw.atualizadoEm,
    };
  }
}
