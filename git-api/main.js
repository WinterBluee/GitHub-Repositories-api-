import '../git-api/style.css'

// Selecionando os elementos do DOM
const form = document.getElementById('githubForm');
const reposList = document.getElementById('reposList');

// Função para buscar o número de commits de um repositório
async function fetchCommits(username, repoName) {
  const apiUrl = `https://api.github.com/repos/${username}/${repoName}/commits`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erro ao buscar commits para o repositório ${repoName}`);
    }
    const commits = await response.json();
    return commits.length; // Retorna o número de commits
  } catch (error) {
    console.error(error);
    return 0; // Em caso de erro, retorna 0 commits
  }
}

// Função para buscar repositórios de um usuário
async function fetchRepos(username) {
  const apiUrl = `https://api.github.com/users/${username}/repos`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Erro ao buscar repositórios');
    }
    const repos = await response.json();

    // Limpar a lista antes de adicionar novos repositórios
    reposList.innerHTML = '';

    repos.forEach(async (repo) => {
      // Criando elementos para exibir informações dos repositórios
      const repoElement = document.createElement('div');
      repoElement.classList.add('repo-item');

      // Buscar o número de commits
      const commitCount = await fetchCommits(username, repo.name);

      // Adicionar o conteúdo HTML para cada informação do repositório
      repoElement.innerHTML = `
        <h3>${repo.name}</h3>
        <p><strong>Commits:</strong> ${commitCount}</p>
        <p><strong>Stars:</strong> ${repo.stargazers_count}</p>
        <p><strong>Forks:</strong> ${repo.forks_count}</p>
        <p><strong>Descrição:</strong> ${repo.description ? repo.description : 'Sem descrição'}</p>
        <a href="${repo.html_url}" target="_blank">Ver repositório</a>
      `;

      reposList.appendChild(repoElement);
    });
  } catch (error) {
    reposList.innerHTML = `<p>${error.message}</p>`;
  }
}

// Event listener para o formulário
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Previne o comportamento padrão do formulário

  const username = document.getElementById('username').value.trim();
  if (username) {
    fetchRepos(username); // Chama a função para buscar os repositórios
  }
});
