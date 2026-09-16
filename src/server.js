import app from './App';

const port = Number(process.env.PORT) || 3018;

app.listen(port, () => {
  console.log(`rodando na porta ${port}...`);
});
