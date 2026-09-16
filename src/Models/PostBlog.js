import Sequelize, { Model } from 'sequelize';

export default class PostBlog extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          msg: 'Slug já existe',
        },
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Título é obrigatório',
          },
        },
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
        defaultValue: '',
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
    }, {
      sequelize,
      tableName: 'posts_blog',
    });

    return this;
  }

  toBlogPost() {
    const post = this.toJSON();
    return {
      id: post.id,
      slug: post.slug,
      titulo: post.titulo,
      categoria: post.categoria,
      resumo: post.resumo,
      subtitulo: post.subtitulo,
      leitura: post.leitura,
      corpoTexto: post.corpoTexto,
      capaUrl: post.capaUrl || undefined,
      publicado: Boolean(post.publicado),
      publicadoEm: post.publicadoEm
        ? new Date(post.publicadoEm).toISOString()
        : null,
    };
  }
}
