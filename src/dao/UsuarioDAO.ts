import type { DatabaseSync } from "node:sqlite";
import { ConnectionFactory } from "../database/ConnectionFactory.ts";
import { Usuario } from "../model/Usuario.ts";

export class UsuarioDAO {
  private readonly connectionFactory: ConnectionFactory;

  constructor() {
    this.connectionFactory = new ConnectionFactory();
  }  
  
  // Método para criar a tabela Usuário:
  createTable(): void {
    this.withConnection((connection) => {
      connection.exec(`
        CREATE TABLE IF NOT EXISTS usuario (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome VARCHAR(256) NOT NULL,
          nascimento TEXT
        )
      `);
      console.log("Tabela 'usuario' criada ou já existe!");
    });
  }

  // Método para inseriri um registro na tabela Usuário:
  create(usuario: Usuario): Usuario {
    return this.withConnection((connection) => {
      connection
        .prepare("INSERT INTO usuario (nome, nascimento) VALUES (?, ?)")
        .run(usuario.nome, usuario.nascimento);

      usuario.id = this.readLastInsertedId(connection);
      console.log(`
        USUÁRIO GRAVADO NO BANCO DE DADOS: \n
        ID: ${usuario.id}\n
        NOME: ${usuario.nome}\n
        DATA DE NASCIMENTO: ${usuario.nascimento}
      `);
      return usuario;
    });
  }

  // Método para ler a chave primária do último registro inserido na tabela Usuário:
  readLastInsertedId(connection: DatabaseSync): number {
    const row = connection
      .prepare("SELECT last_insert_rowid() AS id")
      .get();
    if (!row || typeof row.id !== "number") {
      throw new Error("Não foi possível recuperar o identificador gerado.");
    }
    return row.id;
  }

  // Método para ler um registro inserido na tabela Usuário:
  read(id: number): Usuario | null {
    return this.withConnection((connection) => {
      const row = connection
        .prepare(
          "SELECT id, nome, nascimento FROM usuario WHERE id = ?"
        )
        .get(id);

      if (!row) {
        console.log("Usuário não encontrado!");
        return null;
      }

      if (
        typeof row.id !== "number" ||
        typeof row.nome !== "string" ||
        (typeof row.nascimento !== "string" && row.nascimento !== null)
      ) {
        throw new Error("O banco retornou um registro de usuário inválido.");
      }

      const usuario = new Usuario(row.id, row.nome, row.nascimento);
      console.log(`
        USUÁRIO LIDO DO BANCO DE DADOS: \n
        ID: ${usuario.id}\n
        NOME: ${usuario.nome}\n
        DATA DE NASCIMENTO: ${usuario.nascimento}
      `);
      return usuario;
    });
  }

  // Método para atualizar/modificar um registro inserido na tabela Usuário:
  update(usuario: Usuario): void {
    this.withConnection((connection) => {
      connection
        .prepare(
          "UPDATE usuario SET nome = ?, nascimento = ? WHERE id = ?"
        )
        .run(usuario.nome, usuario.nascimento, usuario.id);
      console.log(
        `O usuário ${usuario.nome} foi atualizado no banco de dados!`
      );
    });
  }

  // Método para excluir um registro inserido na tabela Usuário:
  delete(usuario: Usuario): void {
    this.withConnection((connection) => {
      connection
        .prepare("DELETE FROM usuario WHERE id = ?")
        .run(usuario.id);
      console.log(`O usuario ${usuario.nome} foi removido do BD.`);
    });
  }

  private withConnection<T>(operation: (connection: DatabaseSync) => T): T {
    const connection = this.connectionFactory.createConnection();
    try {
      return operation(connection);
    } finally {
      connection.close();
    }
  }
}
