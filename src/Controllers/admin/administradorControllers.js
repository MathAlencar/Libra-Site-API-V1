import Administrador from '../../Models/Administrador';

class AdministradorControllers {
  async me(req, res) {
    try {
      const user = await Administrador.findByPk(req.userId, {
        attributes: ['id', 'nome', 'email'],
      });

      if (!user) {
        return res.status(401).json({
          errors: ['Login required'],
        });
      }

      return res.status(200).json({
        id: user.id,
        nome: user.nome,
        email: user.email,
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }
}

export default new AdministradorControllers();
