import PostBlog from '../../Models/PostBlog';

class BlogControllers {
  async index(req, res) {
    try {
      const posts = await PostBlog.findAll({
        where: { publicado: true },
        order: [['publicadoEm', 'DESC']],
      });

      return res.status(200).json(posts.map((post) => post.toBlogPost()));
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async show(req, res) {
    try {
      const post = await PostBlog.findOne({
        where: {
          slug: req.params.slug,
          publicado: true,
        },
      });

      if (!post) {
        return res.status(404).json({
          errors: ['Post não encontrado'],
        });
      }

      return res.status(200).json(post.toBlogPost());
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async adminIndex(req, res) {
    try {
      const posts = await PostBlog.findAll({
        order: [['publicadoEm', 'DESC']],
      });

      return res.status(200).json(posts.map((post) => post.toBlogPost()));
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async store(req, res) {
    try {
      const {
        slug,
        titulo,
        categoria = '',
        resumo = '',
        subtitulo = '',
        leitura = '',
        corpoTexto = '',
        capaUrl = null,
        publicado = false,
        publicadoEm,
      } = req.body;

      if (!slug || !titulo) {
        return res.status(400).json({
          errors: ['slug e titulo são obrigatórios'],
        });
      }

      const post = await PostBlog.create({
        slug,
        titulo,
        categoria,
        resumo,
        subtitulo,
        leitura,
        corpoTexto,
        capaUrl: capaUrl || null,
        publicado: Boolean(publicado),
        publicadoEm: publicadoEm ? new Date(publicadoEm) : new Date(),
      });

      return res.status(201).json(post.toBlogPost());
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async update(req, res) {
    try {
      const post = await PostBlog.findByPk(req.params.id);

      if (!post) {
        return res.status(404).json({
          errors: ['Post não encontrado'],
        });
      }

      const payload = { ...req.body };
      delete payload.id;

      if (payload.publicadoEm) {
        payload.publicadoEm = new Date(payload.publicadoEm);
      }

      if (payload.capaUrl === '') {
        payload.capaUrl = null;
      }

      await post.update(payload);

      return res.status(200).json(post.toBlogPost());
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async delete(req, res) {
    try {
      const post = await PostBlog.findByPk(req.params.id);

      if (!post) {
        return res.status(404).json({
          errors: ['Post não encontrado'],
        });
      }

      await post.destroy();

      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }
}

export default new BlogControllers();
