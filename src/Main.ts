import { UsuarioDAO } from "./dao/UsuarioDAO.ts";
import { Usuario } from "./model/Usuario.ts";

const usuarioDAO = new UsuarioDAO();

usuarioDAO.createTable();

let usuario = new Usuario(0, "Ana", "2000-06-07");
usuarioDAO.create(usuario);
usuarioDAO.read(usuario.id);

usuario.nome = "Ana Silva";
usuarioDAO.update(usuario);
usuarioDAO.read(usuario.id);

usuarioDAO.delete(usuario);
usuarioDAO.read(usuario.id);

usuario = new Usuario(0, "Bruna", "2006-08-07");
usuarioDAO.create(usuario);
usuarioDAO.read(usuario.id);

usuario.nome = "Bruna Gomes";
usuarioDAO.update(usuario);
usuarioDAO.read(usuario.id);

usuario = new Usuario(0, "Carlos Pereira", "2009-11-15");
usuarioDAO.create(usuario);
usuarioDAO.read(usuario.id);
