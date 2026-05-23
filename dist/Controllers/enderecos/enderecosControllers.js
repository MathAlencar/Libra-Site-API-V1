"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _Enderecos = require('../../Models/Enderecos'); var _Enderecos2 = _interopRequireDefault(_Enderecos);
var _Alunos = require('../../Models/Alunos'); var _Alunos2 = _interopRequireDefault(_Alunos);
var _Personal = require('../../Models/Personal'); var _Personal2 = _interopRequireDefault(_Personal);

const ENDERECO_ATTRIBUTES = [
  'id',
  'aluno_id',
  'personal_id',
  'rua',
  'numero',
  'complemento',
  'bairro',
  'cidade',
  'estado',
  'cep',
];

const PERFIS = {
  aluno: {
    campo: 'aluno_id',
    model: _Alunos2.default,
    nome: 'aluno',
  },
  personal: {
    campo: 'personal_id',
    model: _Personal2.default,
    nome: 'personal',
  },
};

const perfilInformado = (id) => id !== undefined && id !== null && id !== '';

class EnderecosControllers {
  async storeByPerfil(req, res, tipoPerfil) {
    try {
      const perfil = PERFIS[tipoPerfil];
      const perfilId = req.userID;

      if (!perfilInformado(perfilId)) {
        return res.status(401).json({
          errors: ['Login obrigatório para cadastrar endereço.'],
        });
      }

      const usuario = await perfil.model.findByPk(perfilId);

      if (!usuario) {
        return res.status(404).json({
          errors: [`Nenhum ${perfil.nome} foi encontrado com o id ${perfilId}.`],
        });
      }

      const enderecoExistente = await _Enderecos2.default.findOne({
        where: { [perfil.campo]: perfilId },
        attributes: ['id', perfil.campo],
      });

      if (enderecoExistente) {
        return res.status(409).json({
          errors: [`Já existe um endereço vinculado a este ${perfil.nome}.`],
          data: {
            endereco_id: enderecoExistente.id,
            tipo_perfil: tipoPerfil,
            perfil_id: perfilId,
          },
        });
      }

      const dadosEndereco = {
        ...req.body,
        aluno_id: null,
        personal_id: null,
        [perfil.campo]: perfilId,
      };

      const endereco = await _Enderecos2.default.create(dadosEndereco);

      return res.status(201).json({
        message: `Endereço cadastrado com sucesso para o ${perfil.nome}.`,
        data: endereco,
      });
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _ => _.errors, 'optionalAccess', _2 => _2.map, 'call', _3 => _3((err) => err.message)]) || [e.message],
      });
    }
  }

  async storeAluno(req, res) {
    return this.storeByPerfil(req, res, 'aluno');
  }

  async storePersonal(req, res) {
    return this.storeByPerfil(req, res, 'personal');
  }

  async store(req, res) {
    return res.status(400).json({
      errors: [
        'Cadastro de endereço deve usar o usuário logado. Use POST /enderecos/aluno ou POST /enderecos/personal.',
      ],
    });
  }

  async show(req, res) {
    try {
      const endereco = await _Enderecos2.default.findByPk(req.params.id, {
        attributes: ENDERECO_ATTRIBUTES,
      });

      if (!endereco) {
        return res.status(404).json({
          errors: [`Nenhum endereço foi encontrado com o id ${req.params.id}.`],
        });
      }

      return res.status(200).json({
        message: 'Endereço encontrado com sucesso.',
        data: endereco,
      });
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _4 => _4.errors, 'optionalAccess', _5 => _5.map, 'call', _6 => _6((err) => err.message)]) || [e.message],
      });
    }
  }

  async showByPerfil(req, res) {
    try {
      const { tipo, id } = req.params;
      const tipoPerfil = String(tipo).toLowerCase();
      const perfil = PERFIS[tipoPerfil];

      if (!perfil) {
        return res.status(400).json({
          errors: ['Tipo de perfil inválido. Use "aluno" ou "personal".'],
        });
      }

      const usuario = await perfil.model.findByPk(id, {
        attributes: ['id'],
      });

      if (!usuario) {
        return res.status(404).json({
          errors: [`Nenhum ${perfil.nome} foi encontrado com o id ${id}.`],
        });
      }

      const endereco = await _Enderecos2.default.findOne({
        where: { [perfil.campo]: id },
        attributes: ENDERECO_ATTRIBUTES,
      });

      if (!endereco) {
        return res.status(404).json({
          errors: [`Nenhum endereço foi encontrado para este ${perfil.nome}.`],
        });
      }

      return res.status(200).json({
        message: 'Endereço encontrado com sucesso.',
        data: endereco,
      });
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _7 => _7.errors, 'optionalAccess', _8 => _8.map, 'call', _9 => _9((err) => err.message)]) || [e.message],
      });
    }
  }

  async update(req, res) {
    try {
      if (!req.params.id) {
        return res.status(404).json({
          errors: ['Chave não enviada para update'],
        });
      }

      const endereco = await _Enderecos2.default.findByPk(req.params.id);

      if (!endereco) {
        return res.status(400).json({
          errors: ['Endereço não encontrado'],
        });
      }

      const novosDados = await endereco.update(req.body);

      return res.status(200).json({
        message: 'Endereço atualizado com sucesso.',
        data: novosDados,
      });
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _10 => _10.errors, 'optionalAccess', _11 => _11.map, 'call', _12 => _12((err) => err.message)]) || [e.message],
      });
    }
  }

  async delete(req, res) {
    try {
      if (!req.params.id) {
        return res.status(404).json({
          errors: ['Chave não enviada para delete'],
        });
      }

      const endereco = await _Enderecos2.default.findByPk(req.params.id);

      if (!endereco) {
        return res.status(400).json({
          errors: ['Endereço não encontrado'],
        });
      }

      await endereco.destroy();

      return res.status(200).json({
        message: 'Endereço excluído com sucesso.',
      });
    } catch (e) {
      return res.status(400).json({
        errors: _optionalChain([e, 'access', _13 => _13.errors, 'optionalAccess', _14 => _14.map, 'call', _15 => _15((err) => err.message)]) || [e.message],
      });
    }
  }
}

exports. default = new EnderecosControllers();
