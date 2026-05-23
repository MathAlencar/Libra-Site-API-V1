"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize');
var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);

var _Administrador = require('../Models/Administrador'); var _Administrador2 = _interopRequireDefault(_Administrador);
var _Personal = require('../Models/Personal'); var _Personal2 = _interopRequireDefault(_Personal);
var _FotoPersonal = require('../Models/FotoPersonal'); var _FotoPersonal2 = _interopRequireDefault(_FotoPersonal);
var _RGPersonal = require('../Models/RGPersonal'); var _RGPersonal2 = _interopRequireDefault(_RGPersonal);
var _DocumentoFotoPersonal = require('../Models/DocumentoFotoPersonal'); var _DocumentoFotoPersonal2 = _interopRequireDefault(_DocumentoFotoPersonal);
var _PersonalAgenda = require('../Models/PersonalAgenda'); var _PersonalAgenda2 = _interopRequireDefault(_PersonalAgenda);
var _Diploma = require('../Models/Diploma'); var _Diploma2 = _interopRequireDefault(_Diploma);
var _Alunos = require('../Models/Alunos'); var _Alunos2 = _interopRequireDefault(_Alunos);
var _FotoAlunos = require('../Models/FotoAlunos'); var _FotoAlunos2 = _interopRequireDefault(_FotoAlunos);
var _AgendaAulas = require('../Models/AgendaAulas'); var _AgendaAulas2 = _interopRequireDefault(_AgendaAulas);
var _Enderecos = require('../Models/Enderecos'); var _Enderecos2 = _interopRequireDefault(_Enderecos);
var _Conversa = require('../Models/Conversa'); var _Conversa2 = _interopRequireDefault(_Conversa);
var _Mensagem = require('../Models/Mensagem'); var _Mensagem2 = _interopRequireDefault(_Mensagem);
var _ExercicioPersonal = require('../Models/ExercicioPersonal'); var _ExercicioPersonal2 = _interopRequireDefault(_ExercicioPersonal);
var _planoTreino = require('../Models/planoTreino'); var _planoTreino2 = _interopRequireDefault(_planoTreino);
var _sessaoTreino = require('../Models/sessaoTreino'); var _sessaoTreino2 = _interopRequireDefault(_sessaoTreino);
var _itemExercicio = require('../Models/itemExercicio'); var _itemExercicio2 = _interopRequireDefault(_itemExercicio);
var _videoExercicio = require('../Models/videoExercicio'); var _videoExercicio2 = _interopRequireDefault(_videoExercicio);

var _Subconta = require('../Models/Subconta'); var _Subconta2 = _interopRequireDefault(_Subconta);
var _PlanosPersonal = require('../Models/PlanosPersonal'); var _PlanosPersonal2 = _interopRequireDefault(_PlanosPersonal);
var _Cobranca = require('../Models/Cobranca'); var _Cobranca2 = _interopRequireDefault(_Cobranca);
var _Notificacao = require('../Models/Notificacao'); var _Notificacao2 = _interopRequireDefault(_Notificacao);

const models = [
  _Administrador2.default,
  _Personal2.default,
  _FotoPersonal2.default,
  _PersonalAgenda2.default,
  _Alunos2.default,
  _FotoAlunos2.default,
  _AgendaAulas2.default,
  _Enderecos2.default,
  _Conversa2.default,
  _Mensagem2.default,
  _ExercicioPersonal2.default,
  _planoTreino2.default,
  _sessaoTreino2.default,
  _itemExercicio2.default,
  _videoExercicio2.default,
  _Subconta2.default,
  _PlanosPersonal2.default,
  _Cobranca2.default,
  _Notificacao2.default,
  _RGPersonal2.default,
  _DocumentoFotoPersonal2.default,
  _Diploma2.default
];

const connection = new (0, _sequelize.Sequelize)(_database2.default);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));
