import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import connection from '../database';
import ConteudoSite from '../Models/ConteudoSite';
import PostBlog from '../Models/PostBlog';

const APPLY = process.argv.includes('--apply');
const SKIP_KEYS = new Set(['id', 'slug', 'versao', 'atualizadoEm']);
const WORD_RE = /(?<![\p{L}\p{N}_-])(pra|Pra|pros|Pros|pro|Pro)(?![\p{L}\p{N}_-])/gu;
const REPLACEMENTS = {
  pra: 'para',
  Pra: 'Para',
  pro: 'para o',
  Pro: 'Para o',
  pros: 'para os',
  Pros: 'Para os',
};

function parseJson(value) {
  if (value == null) return value;
  if (typeof value === 'string') return JSON.parse(value);
  return value;
}

function fixText(text) {
  let out = text.replace(WORD_RE, (match) => REPLACEMENTS[match] || match);
  out = out.replace(/(?<![\p{L}\p{N}_-])para gente(?![\p{L}\p{N}_-])/gu, 'para a gente');
  out = out.replace(/(?<![\p{L}\p{N}_-])Para gente(?![\p{L}\p{N}_-])/gu, 'Para a gente');
  return out;
}

function walk(value, path, changes) {
  if (typeof value === 'string') {
    const after = fixText(value);
    if (after !== value) {
      changes.push({ path, before: value, after });
    }
    return after;
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => walk(item, `${path}[${index}]`, changes));
  }

  if (value && typeof value === 'object') {
    const next = {};
    Object.entries(value).forEach(([key, child]) => {
      const childPath = path ? `${path}.${key}` : key;
      next[key] = SKIP_KEYS.has(key) ? child : walk(child, childPath, changes);
    });
    return next;
  }

  return value;
}

function printChanges(title, changes) {
  console.log(`\n=== ${title} (${changes.length} trecho${changes.length === 1 ? '' : 's'}) ===`);
  if (!changes.length) {
    console.log('Nenhuma alteração.');
    return;
  }

  changes.forEach((change) => {
    console.log(`\n${change.path}`);
    console.log(`  antes:  ${change.before}`);
    console.log(`  depois: ${change.after}`);
  });
}

async function backupTables() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dir = resolve(__dirname, '..', '..', 'backups', `fix-pra-para-${stamp}`);
  mkdirSync(dir, { recursive: true });

  const [conteudos, posts] = await Promise.all([
    ConteudoSite.findAll({ raw: true }),
    PostBlog.findAll({ raw: true }),
  ]);

  writeFileSync(resolve(dir, 'conteudo_site.json'), JSON.stringify(conteudos, null, 2), 'utf8');
  writeFileSync(resolve(dir, 'posts_blog.json'), JSON.stringify(posts, null, 2), 'utf8');
  console.log(`Backup salvo em ${dir}`);
}

async function fixConteudo() {
  const row = await ConteudoSite.findOne({ order: [['id', 'ASC']] });
  if (!row) {
    console.log('\nconteudo_site: nenhuma linha.');
    return { changes: [] };
  }

  const original = parseJson(row.conteudo);
  const changes = [];
  const conteudo = walk(original, '', changes);

  printChanges('conteudo_site', changes);

  if (APPLY && changes.length) {
    const agora = new Date();
    const versaoAnterior = Number(row.versao);
    const versao = versaoAnterior + 1;
    conteudo.versao = versao;
    conteudo.atualizadoEm = agora.toISOString();

    await row.update({
      conteudo,
      versao,
      atualizado_em: agora,
    });
    console.log(`conteudo_site id=${row.id} gravado. versao ${versaoAnterior} → ${versao}`);
  }

  return { changes };
}

async function fixPosts() {
  const posts = await PostBlog.findAll({ order: [['publicadoEm', 'ASC']] });
  const allChanges = [];
  const fields = ['titulo', 'resumo', 'subtitulo', 'categoria', 'corpoTexto'];

  posts.forEach((post) => {
    fields.forEach((field) => {
      const before = post[field];
      if (typeof before !== 'string' || !before) return;
      const after = fixText(before);
      if (after === before) return;
      allChanges.push({
        post,
        field,
        path: `posts_blog "${post.titulo}" .${field}`,
        before,
        after,
      });
    });
  });

  printChanges('posts_blog', allChanges);

  if (APPLY && allChanges.length) {
    const byPost = new Map();
    allChanges.forEach((change) => {
      if (!byPost.has(change.post)) byPost.set(change.post, {});
      byPost.get(change.post)[change.field] = change.after;
    });

    await Promise.all(
      [...byPost.entries()].map(([post, payload]) => post.update(payload)),
    );
    console.log(`posts_blog: ${byPost.size} post(s) gravado(s).`);
  }

  return { changes: allChanges };
}

async function run() {
  console.log(APPLY ? 'Modo --apply: vai gravar no banco.' : 'Modo prévia (dry-run). Nada será gravado. Use --apply para persistir.');

  try {
    if (APPLY) await backupTables();
    await fixConteudo();
    await fixPosts();
  } finally {
    await connection.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
