import ConteudoSite from '../../Models/ConteudoSite';

class ConteudoControllers {
  async index(req, res) {
    try {
      const row = await ConteudoSite.findOne({ order: [['id', 'ASC']] });

      if (!row) {
        return res.status(404).json({
          errors: ['Conteúdo não encontrado'],
        });
      }

      return res.status(200).json(row.toSiteContent());
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async update(req, res) {
    try {
      const body = req.body || {};

      if (body.versao === undefined || body.versao === null || Number.isNaN(Number(body.versao))) {
        return res.status(400).json({
          errors: ['Campo versao é obrigatório'],
        });
      }

      const row = await ConteudoSite.findOne({ order: [['id', 'ASC']] });

      if (!row) {
        return res.status(404).json({
          errors: ['Conteúdo não encontrado'],
        });
      }

      if (Number(body.versao) !== Number(row.versao)) {
        return res.status(409).json({
          errors: ['Conteúdo desatualizado. Recarregue e tente novamente.'],
          versao: row.versao,
        });
      }

      const agora = new Date();
      const novaVersao = Number(row.versao) + 1;
      const conteudo = {
        ...body,
        versao: novaVersao,
        atualizadoEm: agora.toISOString(),
      };

      await row.update({
        conteudo,
        versao: novaVersao,
        atualizado_em: agora,
      });

      return res.status(200).json(row.toSiteContent());
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }
}

export default new ConteudoControllers();
