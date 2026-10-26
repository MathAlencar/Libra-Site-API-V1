import dotenv from 'dotenv';
import { mkdirSync } from 'fs';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '..', '.env') });

import './database';

import cors from 'cors';
import express from 'express';
import tokenRoutes from './routes/admin/tokenRoutes';
import adminRoutes from './routes/admin/adminRoutes';
import adminBlogRoutes from './routes/admin/adminBlogRoutes';
import adminLeadsRoutes from './routes/admin/adminLeadsRoutes';
import conteudoRoutes from './routes/conteudo/conteudoRoutes';
import uploadRoutes from './routes/upload/uploadRoutes';
import blogRoutes from './routes/blog/blogRoutes';
import leadsRoutes from './routes/leads/leadsRoutes';

const uploadRoot = resolve(__dirname, '..', 'upload');
mkdirSync(resolve(uploadRoot, 'images'), { recursive: true });
mkdirSync(resolve(uploadRoot, 'videos'), { recursive: true });

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.set('trust proxy', 1);

    const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

    this.app.use(cors({
      origin: origins,
      credentials: true,
    }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json({ limit: '2mb' }));

    this.app.use(
      '/videos',
      express.static(resolve(uploadRoot, 'videos')),
    );

    this.app.use(
      '/images',
      express.static(resolve(uploadRoot, 'images')),
    );
  }

  routes() {
    this.app.get('/', (req, res) => {
      res.json({
        ok: true,
        message: 'API Libra Crédito',
      });
    });

    this.app.get('/health', (req, res) => {
      res.status(200).json({ ok: true });
    });

    this.app.use('/token', tokenRoutes);
    this.app.use('/admin/blog', adminBlogRoutes);
    this.app.use('/admin/leads', adminLeadsRoutes);
    this.app.use('/admin', adminRoutes);
    this.app.use('/conteudo', conteudoRoutes);
    this.app.use('/upload', uploadRoutes);
    this.app.use('/blog', blogRoutes);
    this.app.use('/leads', leadsRoutes);
  }
}

export default new App().app;
