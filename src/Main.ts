import express, { type NextFunction, type Request, type Response } from "express";
import { UsuarioDAO } from "./dao/UsuarioDAO.ts";
import { Usuario } from "./model/Usuario.ts";

// A aplicação Express recebe as requisições e delega o acesso aos dados ao DAO.
const app = express();
const usuarioDAO = new UsuarioDAO();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());
usuarioDAO.createTable();

// Valida os dados do corpo antes de criar ou atualizar um usuário.
function validarUsuario(nome: unknown, nascimento: unknown): string | null {
  if (typeof nome !== "string" || nome.trim() === "") {
    return "O campo nome deve ser informado.";
  }

  if (nascimento !== undefined && nascimento !== null && typeof nascimento !== "string") {
    return "O campo nascimento deve ser uma data em formato texto (AAAA-MM-DD).";
  }

  return null;
}

// GET /usuarios: lista todos os usuários cadastrados.
app.get("/usuarios", (request: Request, response: Response) => {
  response.json(usuarioDAO.readAll());
});

// GET /usuarios/:id: busca um usuário pelo identificador.
app.get("/usuarios/:id", (request: Request, response: Response) => {
  const id = Number(request.params.id);
  const usuario = usuarioDAO.read(id);

  if (!usuario) {
    response.status(404).json({ mensagem: "Usuário não encontrado." });
    return;
  }

  response.json(usuario);
});

// POST /usuarios: insere um novo usuário e devolve o registro com seu id.
app.post("/usuarios", (request: Request, response: Response) => {
  /*
   * Se request.body.nascimento existir, seu valor será usado.
   * Se a propriedade for undefined ou não existir, nascimento receberá null.
   */
  const { nome, nascimento = null } = request.body as { nome?: unknown; nascimento?: unknown };

  const erro = validarUsuario(nome, nascimento);

  if (erro) {
    response.status(400).json({ mensagem: erro });
    return;
  }

  const usuario = usuarioDAO.create(new Usuario(0, nome as string, nascimento as string | null));
  response.status(201).location(`/usuarios/${usuario.id}`).json(usuario);
});

// PUT /usuarios/:id: substitui os dados informados para um usuário existente.
app.put("/usuarios/:id", (request: Request, response: Response) => {
  const id = Number(request.params.id);

  /*
   * Se request.body.nascimento existir, seu valor será usado.
   * Se a propriedade for undefined ou não existir, nascimento receberá null.
   */
  const { nome, nascimento = null } = request.body as { nome?: unknown; nascimento?: unknown };
  
  const erro = validarUsuario(nome, nascimento);

  if (erro) {
    response.status(400).json({ mensagem: erro });
    return;
  }

  const usuario = new Usuario(id, nome as string, nascimento as string | null);
  const atualizado = usuarioDAO.update(usuario);

  if (!atualizado) {
    response.status(404).json({ mensagem: "Usuário não encontrado." });
    return;
  }

  response.json(usuario);
});

// DELETE /usuarios/:id: remove o usuário informado pelo identificador.
app.delete("/usuarios/:id", (request: Request, response: Response) => {
  const id = Number(request.params.id);
  const usuario = usuarioDAO.read(id);

  if (!usuario) {
    response.status(404).json({ mensagem: "Usuário não encontrado." });
    return;
  }

  usuarioDAO.delete(usuario);
  response.status(204).send();
});

// Resposta simples para verificar se o serviço está disponível.
app.get("/", (request: Request, response: Response) => {
  response.json({ mensagem: "API de usuários ativa", recursos: "/usuarios" });
});

// Trata falhas inesperadas sem interromper o servidor.
app.use((error: unknown, request: Request, response: Response, next: NextFunction) => {
  console.error(error);
  response.status(500).json({ mensagem: "Erro interno do servidor." });
});

app.listen(port, () => {
  console.log(`API disponível em http://localhost:${port}`);
});
