# API CRUD com Node.js, TypeScript, Express, SQLite e DAO

Este projeto demonstra como separar uma API HTTP das regras de acesso ao banco de dados SQLite. 

O Express recebe as requisições, enquanto a classe `UsuarioDAO` concentra os comandos SQL.

## Tecnologias

- Node.js
- TypeScript
- Express
- SQLite integrado ao Node.js (`node:sqlite`)
- Extensão REST Client para o VS Code

## SQLite Viewer

No Codespace, instalar a extensão (plugin) VS Code `SQLite Viewer`: 

![Alt: extensão (plugin) SQLite Viewer.](SQLiteViewerForVSCode.png)

### Comandos Iniciais

```bash
sudo apt update
```

```bash
sudo apt install -y nodejs
```

```bash
node -v
```

```bash
npm install -g npm@11.19.0
```

```bash
npm -v
```

### Iniciar um projeto `Node.js`:

```bash
npm init -y
```

```bash
npm install -D typescript @types/node
```

Crie o arquivo `tsconfig.json` com o conteúdo abaixo:

```json
{
  "compilerOptions": {
    // Versao de JavaScript gerada e recursos de linguagem disponiveis.
    "target": "ES2022",
    // Usa o sistema de modulos ESM/CommonJS definido pelo Node.js.
    "module": "NodeNext",
    // Resolve importacoes seguindo as regras de modulos do Node.js.
    "moduleResolution": "NodeNext",
    // Ativa todas as verificacoes rigorosas de tipos do TypeScript.
    "strict": true,
    // Inclui as definicoes de tipos do Node.js.
    "types": ["node"],
    // Permite importar arquivos usando a extensao .ts.
    "allowImportingTsExtensions": true,
    // Nao gera arquivos JavaScript durante a compilacao.
    "noEmit": true
  },
  // Inclui todos os arquivos TypeScript dentro da pasta src (em qualquer subpasta e em qualquer profundidade).
  "include": ["src/**/*.ts"]
}
```

Crie o arquivo `.gitignore` com o conteúdo abaixo:

```txt
node_modules/
```

### Variável de Ambiente

Criar o arquivo `.env`.

O arquivo `.env` é opcional e deve ficar na raiz do projeto. 

Para definir um caminho personalizado para o banco, crie o arquivo com o conteúdo abaixo:

```txt
SQLITE_DB_PATH=./src/database/banco_de_dados.db
```

Se o arquivo `.env` não existir ou a variável de ambiente `SQLITE_DB_PATH` não estiver definida, a aplicação usará `.src/database/teste.db`. 

Para um caminho personalizado, a pasta indicada deve existir e permitir gravação. **OBS**: o SQLite cria o arquivo do banco, mas não cria as pastas. Então, criar a pasta:

```txt
./src/database/
```

Caso seja necessário, execute `CTRL + SHIFT + P`, informe `TypeScript: Restart TS Server` e pressione `<ENTER>`. Isso atualiza os diagnósticos do TypeScript no VS Code.

### package.json

No arquivo `package.json`, substituir `"type": "commonjs",`  por `"type": "module",`:

Inserir as linhas:

```json
    "dev": "node --env-file-if-exists=.env --watch ./src/Main.ts",
    "start": "npm run dev"
```

```json
{
  "name": "node-typescript-api-crud-com-express-sqlite-e-padrao-dao",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "node --env-file-if-exists=.env --watch ./src/Main.ts",
    "start": "npm run dev"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/wdiasmaciel/node-typescript-bd-sqlite-05-dao.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "bugs": {
    "url": "https://github.com/wdiasmaciel/node-typescript-bd-sqlite-05-dao/issues"
  },
  "homepage": "https://github.com/wdiasmaciel/node-typescript-bd-sqlite-05-dao#readme",
  "devDependencies": {
    "@types/node": "^26.6.5",
    "typescript": "^7.0.2"
  }
}
```

## Estrutura e padrão DAO

- `src/Main.ts`: configura o servidor Express e os endpoints.
- `src/model/Usuario.ts`: representa um usuário e seus atributos.
- `src/dao/UsuarioDAO.ts`: traduz a operação do domínio em comandos SQL.
- `src/database/ConnectionFactory.ts`: centraliza a abertura da conexão SQLite.

1. O padrão DAO evita que rotas e regras HTTP misturem SQL diretamente. 

2. Assim, a mesma classe de acesso pode ser reutilizada por interfaces de linha de comando, APIs ou outras aplicações.

### Executar
 
```bash
npm start
```

Saída:
```text

> typescript-bd-sqlite-05-dao@1.0.0 start
> npm run dev


> typescript-bd-sqlite-05-dao@1.0.0 dev
> node --env-file-if-exists=.env --watch ./src/Main.ts

Conexão com SQLite estabelecida!
Tabela 'usuario' criada ou já existe!
Conexão com SQLite estabelecida!

        USUÁRIO GRAVADO NO BANCO DE DADOS: 

        ID: 1

        NOME: Ana

        DATA DE NASCIMENTO: 2000-06-07
      
Conexão com SQLite estabelecida!

        USUÁRIO LIDO DO BANCO DE DADOS: 

        ID: 1

        NOME: Ana

        DATA DE NASCIMENTO: 2000-06-07
      
Conexão com SQLite estabelecida!
O usuário Ana Silva foi atualizado no banco de dados!
Conexão com SQLite estabelecida!

        USUÁRIO LIDO DO BANCO DE DADOS: 

        ID: 1

        NOME: Ana Silva

        DATA DE NASCIMENTO: 2000-06-07
      
Conexão com SQLite estabelecida!
O usuario Ana Silva foi removido do BD.
Conexão com SQLite estabelecida!
Usuário não encontrado!
Conexão com SQLite estabelecida!

        USUÁRIO GRAVADO NO BANCO DE DADOS: 

        ID: 2

        NOME: Bruna

        DATA DE NASCIMENTO: 2006-08-07
      
Conexão com SQLite estabelecida!

        USUÁRIO LIDO DO BANCO DE DADOS: 

        ID: 2

        NOME: Bruna

        DATA DE NASCIMENTO: 2006-08-07
      
Conexão com SQLite estabelecida!
O usuário Bruna Gomes foi atualizado no banco de dados!
Conexão com SQLite estabelecida!

        USUÁRIO LIDO DO BANCO DE DADOS: 

        ID: 2

        NOME: Bruna Gomes

        DATA DE NASCIMENTO: 2006-08-07
      
Conexão com SQLite estabelecida!

        USUÁRIO GRAVADO NO BANCO DE DADOS: 

        ID: 3

        NOME: Carlos Pereira

        DATA DE NASCIMENTO: 2009-11-15
      
Conexão com SQLite estabelecida!

        USUÁRIO LIDO DO BANCO DE DADOS: 

        ID: 3

        NOME: Carlos Pereira

        DATA DE NASCIMENTO: 2009-11-15
```

## Como executar

Instale as dependências e inicie o servidor:

```bash
npm install
npm start
```

A API ficará disponível em `http://localhost:3000`. 

1. Para alterar a porta, defina a variável `PORT`; 

2. Para alterar o banco, defina `SQLITE_DB_PATH`.

## Rotas da API

| Método | Rota | Finalidade |
|---|---|---|
| `GET` | `/` | Verifica se a API está ativa |
| `GET` | `/usuarios` | Lista todos os usuários |
| `GET` | `/usuarios/:id` | Busca um usuário pelo id |
| `POST` | `/usuarios` | Cadastra um usuário |
| `PUT` | `/usuarios/:id` | Atualiza um usuário existente |
| `DELETE` | `/usuarios/:id` | Remove um usuário |

Exemplo de criação de usuário:

```json
{
  "nome": "Ana Silva",
  "nascimento": "2000-06-07"
}
```

## Testando com REST Client

1. Instale a extensão **REST Client** no VS Code.
2. Inicie a API com `npm start`.
3. Abra o arquivo `teste.http`.
4. Clique em **Send Request** acima da requisição desejada.


## Exercícios

1. **Biblioteca:** implemente o CRUD de livros e autores. Crie as entidades `Autor(id, nome, nacionalidade)` e `Livro(id, titulo, ano_publicacao, id_autor)`, incluindo rotas REST para pesquisar livros pelo autor.

2. **Hotel:** implemente o CRUD de quartos, hóspedes e reservas. Crie `Quarto(id, numero, tipo, diaria)`, `Hospede(id, nome, documento)` e `Reserva(id, id_quarto, id_hospede, entrada, saida, total)`. Garanta que uma alteração não apague o vínculo do quarto e do hóspede.

3. **Streaming:** modele filmes, categorias e assinaturas. Desenvolva os DAOs de `Categoria`, `Filme` e `Assinatura`, com uma rota que liste os filmes de uma categoria selecionada pelo id.

4. **Oficina mecânica:** implemente o cadastro de clientes, veículos e ordens de serviço. Considere `Cliente(id, nome, telefone)`, `Veiculo(id, placa, modelo, id_cliente)` e `OrdemServico(id, id_veiculo, descricao, valor, status)`, incluindo atualização exclusiva do status.

5. **Festival de música:** crie recursos para palcos, artistas e apresentações. Modele `Palco(id, nome, capacidade)`, `Artista(id, nome, genero_musical)` e `Apresentacao(id, id_palco, id_artista, data_apresentacao, horario,duracao)`, com uma API para consultar a programação de um dia informado.
