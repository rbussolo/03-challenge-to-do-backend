const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkRepositoryExists(request, response, next){
  const { id } = request.params;
  
  // Localiza o repositorio
  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  // Adiciona o repositório na requisição
  request.repository = repository;

  // Avança para a proxima etapa
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  // Adiciona o respositório na lista de repositórios
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { repository } = request;
  const { title, url, techs } = request.body;

  // Atualiza o repositório
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { repository } = request;
  
  const reposidotyIndex = repositories.indexOf(repository);

  if (reposidotyIndex === -1) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  // Remove o repositório
  repositories.splice(reposidotyIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepositoryExists, (request, response) => {
  const { repository } = request;

  // Adiciona o like
  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
