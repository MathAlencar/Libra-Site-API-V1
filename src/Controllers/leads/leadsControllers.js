import Lead from '../../Models/Lead';

class LeadsControllers {
  async store(req, res) {
    try {
      const { tipo, dados, resultado, origem } = req.body;

      if (!tipo || (tipo !== 'simulacao' && tipo !== 'parceiro')) {
        return res.status(400).json({
          errors: ['tipo deve ser simulacao ou parceiro'],
        });
      }

      if (!dados || typeof dados !== 'object') {
        return res.status(400).json({
          errors: ['dados é obrigatório'],
        });
      }

      const lead = await Lead.create({
        tipo,
        dados,
        resultado: resultado || null,
        origem: origem || null,
        status: 'novo',
        quando: new Date(),
      });

      return res.status(201).json(lead.toLead());
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async index(req, res) {
    try {
      const where = {};

      if (req.query.tipo === 'simulacao' || req.query.tipo === 'parceiro') {
        where.tipo = req.query.tipo;
      }

      if (req.query.status === 'novo' || req.query.status === 'lido') {
        where.status = req.query.status;
      }

      const leads = await Lead.findAll({
        where,
        order: [['quando', 'DESC']],
      });

      return res.status(200).json(leads.map((lead) => lead.toLead()));
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async update(req, res) {
    try {
      const lead = await Lead.findByPk(req.params.id);

      if (!lead) {
        return res.status(404).json({
          errors: ['Lead não encontrado'],
        });
      }

      const { status } = req.body;

      if (status !== 'lido' && status !== 'novo') {
        return res.status(400).json({
          errors: ['status deve ser lido ou novo'],
        });
      }

      await lead.update({ status });

      return res.status(200).json(lead.toLead());
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }
}

export default new LeadsControllers();
