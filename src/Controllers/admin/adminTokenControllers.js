import jwt from 'jsonwebtoken';
import Administrador from '../../Models/Administrador';

class TokenControllers {
  async store(req, res) {
    try {
      const { email = '', password = '' } = req.body;

      if (!email || !password) {
        return res.status(401).json({
          errors: ['Credenciais inválidas'],
        });
      }

      const user = await Administrador.findOne({ where: { email } });

      if (!user || !(await user.passwordIsValida(password))) {
        return res.status(401).json({
          errors: ['Credenciais inválidas'],
        });
      }

      const { id, nome } = user;
      const expiresIn = process.env.TOKEN_EXPIRATION || '7d';
      const token = jwt.sign({ id, email: user.email }, process.env.TOKEN_SECRET_ADMIN, {
        expiresIn,
      });

      const decoded = jwt.decode(token);
      const expiresAt = new Date(decoded.exp * 1000).toISOString();

      return res.status(200).json({
        token,
        nome,
        email: user.email,
        expiresAt,
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }
}

export default new TokenControllers();
