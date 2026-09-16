import multer from 'multer';
import multerConfig from '../../config/multer';
import multerVideoConfig from '../../config/multerVideo';
import Midia from '../../Models/Midia';

const uploadImagem = multer(multerConfig).single('file');
const uploadVideo = multer(multerVideoConfig).single('file');

class UploadControllers {
  storeImagem(req, res) {
    return uploadImagem(req, res, async (err) => {
      if (err) {
        const message = err.code === 'LIMIT_FILE_SIZE'
          ? 'Imagem excede 5MB'
          : (err.message || 'Erro ao carregar imagem');
        return res.status(400).json({
          errors: [message],
        });
      }

      if (!req.file) {
        return res.status(400).json({
          errors: ['Arquivo de imagem não enviado (campo file)'],
        });
      }

      const url = `/images/${req.file.filename}`;

      await Midia.create({
        nome: req.file.originalname,
        url,
        tipo: 'image',
        alt: req.body.alt || null,
      });

      return res.status(200).json({ url });
    });
  }

  storeVideo(req, res) {
    return uploadVideo(req, res, async (err) => {
      if (err) {
        const message = err.code === 'LIMIT_FILE_SIZE'
          ? 'Vídeo excede 50MB'
          : (err.message || 'Erro ao carregar vídeo');
        return res.status(400).json({
          errors: [message],
        });
      }

      if (!req.file) {
        return res.status(400).json({
          errors: ['Arquivo de vídeo não enviado (campo file)'],
        });
      }

      const url = `/videos/${req.file.filename}`;

      await Midia.create({
        nome: req.file.originalname,
        url,
        tipo: 'video',
        alt: req.body.alt || null,
      });

      return res.status(200).json({ url });
    });
  }
}

export default new UploadControllers();
