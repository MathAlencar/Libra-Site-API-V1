import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database';

import Administrador from '../Models/Administrador';
import Personal from '../Models/Personal';
import PersonalFoto from '../Models/FotoPersonal';
import RgPersonal from '../Models/RGPersonal';
import FotoValidacao from '../Models/DocumentoFotoPersonal';
import PersonalAgenda from '../Models/PersonalAgenda';
import Diploma from '../Models/Diploma';
import Alunos from '../Models/Alunos';
import AlunoFoto from '../Models/FotoAlunos';
import AulaAgenda from '../Models/AgendaAulas';
import Enderecos from '../Models/Enderecos';
import Conversa from '../Models/Conversa';
import Mensagem from '../Models/Mensagem';
import ExercicioPersonal from '../Models/ExercicioPersonal';
import planoTreino from '../Models/planoTreino';
import SessaoTreino from '../Models/sessaoTreino';
import itemExercicio from '../Models/itemExercicio';
import videoExercicio from '../Models/videoExercicio';

import Subconta from '../Models/Subconta';
import PlanosPersonal from '../Models/PlanosPersonal';
import Cobrancas from '../Models/Cobranca';
import Notificacao from '../Models/Notificacao';

const models = [
  Administrador,
  Personal,
  PersonalFoto,
  PersonalAgenda,
  Alunos,
  AlunoFoto,
  AulaAgenda,
  Enderecos,
  Conversa,
  Mensagem,
  ExercicioPersonal,
  planoTreino,
  SessaoTreino,
  itemExercicio,
  videoExercicio,
  Subconta,
  PlanosPersonal,
  Cobrancas,
  Notificacao,
  RgPersonal,
  FotoValidacao,
  Diploma
];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));
