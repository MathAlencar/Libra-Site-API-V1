import Personal from '../../Models/Personal';
import Foto from '../../Models/FotoPersonal';
import Agenda from '../../Models/PersonalAgenda';
import AulaAgenda from '../../Models/AgendaAulas';
import Alunos from '../../Models/Alunos';
import Enderecos from '../../Models/Enderecos';
import DocumentoRG from '../../Models/RGPersonal';
import FotoValidacao from '../../Models/DocumentoFotoPersonal';
import Diploma from '../../Models/Diploma';
import Subconta from '../../Models/Subconta';

class PersonalControllers {
  async store(req, res) {
    try {
      const newUser = await Personal.create(req.body);
      const { id, nome, email } = newUser;
      return res.json({ id, nome, email });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async index(req, res) {
    try {
      // Seguindo o padrão Odata de seleção;
      const select = req.query.$select ? req.query.$select.split(',') : null;
      const expand = req.query.$expand ? req.query.$expand.split(',') : null;

      const options = {
        order: [['id', 'DESC']],
        include: [],
      };

      // Aqui você seleciona atributos de uma mesma tabela;
      if (select && select.length) {
        options.attributes = select;
      } else {
        options.attributes = ['id', 'nome', 'email'];
      }

      // Aqui ele é usado para consultar de outras tabelas;
      if (expand && expand.includes('foto')) {
        options.include.push({
          model: Foto,
          attributes: ['url', 'filename'],
          order: [['id', 'DESC']],
        });
      }

      if (expand && expand.includes('agenda')) {
        options.include.push({
          model: Agenda,
          attributes: ['id', 'personal_id', 'title', 'date_init', 'date_end'],
          order: [['id', 'DESC']],
        });
      }

      if (expand && expand.includes('aulas')) {
        options.include.push({
          model: AulaAgenda,
          attributes: ['id', 'aluno_id', 'status', 'endereco', 'date_init', 'date_end'],
          order: [['id', 'DESC']],
          include: [
            {
              model: Alunos,
              attributes: ['id', 'nome', 'email'],
            },
          ],
        });
      }

      if (expand && expand.includes('endereco')) {
        options.include.push({
          model: Enderecos,
          attributes: ['id', 'aluno_id', 'personal_id', 'rua', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'cep'],
          order: [['id', 'DESC']],
        });
      }

      if (expand && expand.includes('Documento')) {
        options.include.push(
          {
            model: DocumentoRG,
            attributes: ['id', 'url', 'filename', 'status'],
            order: [['id', 'DESC']],
          },
          {
            model: FotoValidacao,
            attributes: ['id', 'url', 'filename', 'status'],
            order: [['id', 'DESC']],
          },
          {
            model: Diploma,
            attributes: ['id', 'url', 'filename', 'status'],
            order: [['id', 'DESC']],
          }
        );
      }

      const users = await Personal.findAll(options);

      const result = users.map(user => {
        const item = user.toJSON();

        if (expand && expand.includes('Documento')) {
          item.Documentos = {
            RG: item.RgPersonals || [],
            FotoValidacao: item.FotoValidacaos || [],
            Diploma: item.Diplomas || [],
          };

          delete item.RgPersonals;
          delete item.FotoValidacaos;
          delete item.Diplomas;
        }

        return item;
      });

      return res.json(result);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async show(req, res) {
    try {
      const select = req.query.$select ? req.query.$select.split(',') : null;
      const expand = req.query.$expand ? req.query.$expand.split(',') : null;

      const options = {
        order: [['id', 'DESC']],
        include: [],
      };

      if (select && select.length) {
        options.attributes = select;
      } else {
        options.attributes = ['id', 'nome', 'email'];
      }

      if (expand && expand.includes('foto')) {
        options.include = [{
          model: Foto,
          attributes: ['url', 'filename'],
          order: [['id', 'DESC']],
        }];
      }

      if (expand && expand.includes('agenda')) {
        options.include.push({
          model: Agenda,
          attributes: ['id', 'personal_id', 'title', 'date_init', 'date_end'],
          order: [['id', 'DESC']],
        });
      }

      if (expand && expand.includes('aulas')) {
        options.include.push({
          model: AulaAgenda,
          attributes: ['id', 'aluno_id', 'status', 'endereco', 'date_init', 'date_end'],
          order: [['id', 'DESC']],
          include: [
            {
              model: Alunos,
              attributes: ['id', 'nome', 'email'],
            },
          ],
        });
      }

      if (expand && expand.includes('endereco')) {
        options.include.push({
          model: Enderecos,
          attributes: ['id', 'aluno_id', 'personal_id', 'rua', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'cep'],
          order: [['id', 'DESC']],
        });
      }

      if (expand && expand.includes('Documento')) {
        options.include.push({
          model: DocumentoRG,
          attributes: ['url', 'filename', 'status'],
          order: [['id', 'DESC']],
        });
      }

      if (expand && expand.includes('Documento')) {
        options.include.push(
          {
            model: DocumentoRG,
            attributes: ['id', 'url', 'filename', 'status'],
            order: [['id', 'DESC']],
          },
          {
            model: FotoValidacao,
            attributes: ['id', 'url', 'filename', 'status'],
            order: [['id', 'DESC']],
          },
          {
            model: Diploma,
            attributes: ['id', 'url', 'filename', 'status'],
            order: [['id', 'DESC']],
          }
        );
      }

      const user = await Personal.findByPk(req.params.id, options);

      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não encontrado em nossa base de dados'],
        });
      }

      const item = user.toJSON();

      if (expand && expand.includes('Documento')) {
        item.Documentos = {
          RG: item.RgPersonals || [],
          FotoValidacao: item.FotoValidacaos || [],
          Diploma: item.Diplomas || [],
        };

        delete item.RgPersonals;
        delete item.FotoValidacaos;
        delete item.Diplomas;
      }

      return res.status(200).json(item);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async update(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          errors: ['Chave não enviada para update'],
        });
      }

      const personal = await Personal.findByPk(req.params.id);

      if (!personal) {
        return res.status(400).json({
          errors: ['Usuário não encontrado'],
        });
      }

      const novosDados = await personal.update(req.body);

      return res.status(200).json(novosDados);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async statusCadastro(req, res) {
  try {
    const personal = await Personal.findByPk(req.params.id, {
      attributes: ['id', 'nome', 'email'],
    });

    if (!personal) {
      return res.status(404).json({
        errors: ['Personal não encontrado em nossa base de dados'],
      });
    }

    const converterStatusDocumento = (registro) => {
      if (!registro) return 'PENDENTE';

      if (registro.status === 'Aprovado') return 'CONCLUIDO';

      if (registro.status === 'Validação') return 'EM ANDAMENTO';

      if (registro.status === 'Negado') return 'NEGADO';

      return 'PENDENTE';
    };

    const converterStatusSubconta = (subconta) => {
      if (!subconta) return 'PENDENTE';

      const cadastroConcluido = subconta.status_cadastro === 'CONCLUIDO';
      const aprovacaoConcluida = subconta.status_aprovacao === 'CONCLUIDO';
      const recebimentoConcluido = subconta.status_recebimento === 'CONCLUIDO';

      if (cadastroConcluido && aprovacaoConcluida && recebimentoConcluido) {
        return 'CONCLUIDO';
      }

      return 'EM ANDAMENTO';
    };

    const [
      possuiEndereco,
      documentoRG,
      fotoValidacao,
      diploma,
      possuiFotoPerfil,
      subconta,
    ] = await Promise.all([
      Enderecos.count({
        where: { personal_id: personal.id },
      }),

      DocumentoRG.findOne({
        where: { personal_id: personal.id },
        attributes: ['id', 'status'],
        order: [['id', 'DESC']],
      }),

      FotoValidacao.findOne({
        where: { personal_id: personal.id },
        attributes: ['id', 'status'],
        order: [['id', 'DESC']],
      }),

      Diploma.findOne({
        where: { personal_id: personal.id },
        attributes: ['id', 'status'],
        order: [['id', 'DESC']],
      }),

      Foto.count({
        where: { personal_id: personal.id },
      }),

      Subconta.findOne({
        where: { personal_id: personal.id },
        attributes: [
          'id',
          'personal_id',
          'status_cadastro',
          'status_aprovacao',
          'status_recebimento',
        ],
        order: [['id', 'DESC']],
      }),
    ]);

    const status = {
      endereco: possuiEndereco > 0 ? 'CONCLUIDO' : 'PENDENTE',

      'ativar-recebimento': converterStatusSubconta(subconta),

      'cadastro-foto': possuiFotoPerfil > 0 ? 'CONCLUIDO' : 'PENDENTE',

      'cadastro-documento': converterStatusDocumento(documentoRG),

      'foto-validada': converterStatusDocumento(fotoValidacao),

      'cadastro-diploma': converterStatusDocumento(diploma),
    };

    return res.status(200).json({
      personal_id: personal.id,
      status,
    });
  } catch (e) {
    return res.status(400).json({
      errors: e.errors?.map((err) => err.message) || [e.message],
    });
  }
}
}

export default new PersonalControllers();
