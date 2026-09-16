import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database';

import Administrador from '../Models/Administrador';
import ConteudoSite from '../Models/ConteudoSite';
import PostBlog from '../Models/PostBlog';
import Lead from '../Models/Lead';
import Midia from '../Models/Midia';

const models = [Administrador, ConteudoSite, PostBlog, Lead, Midia];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));

export default connection;
