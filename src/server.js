import app from './App';

const port = Number(process.env.PORT) || 3018;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`rodando em http://${host}:${port}...`);
});
