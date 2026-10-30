import { DatabaseSync } from "node:sqlite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const defaultDatabasePath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "./", // O banco de dados será criado no diretório corrente.
  "teste.db", // Nome do arquivo do banco de dados.
);

export class ConnectionFactory {
  private readonly databasePath: string;

  /*
   * ??: usa o caminho padrão apenas quando SQLITE_DB_PATH é null ou undefined. 
   * ||: também usa o padrão quando o valor é vazio (""), 0 ou false.
   * Como variáveis de ambiente são strings, a diferença prática aqui é quando 
   * SQLITE_DB_PATH existe, mas está vazia:
   * ??: mantém "" como caminho.
   * ||: trata "" como não configurada e usa defaultDatabasePath.
   * Se um valor vazio deve significar “usar o padrão”, use ||. 
   * Se prefere detectar e reportar uma configuração vazia como inválida, mantenha ?? 
   * e valide-a explicitamente.
   */
  constructor() {
    this.databasePath = process.env.SQLITE_DB_PATH ?? defaultDatabasePath;
  }

  createConnection(): DatabaseSync {
    try {
      const connection = new DatabaseSync(this.databasePath);
      console.log("Conexão com SQLite estabelecida!");
      return connection;
    } catch (error) {
      console.error("Não foi possível estabelecer conexão com SQLite!");
      throw error;
    }
  }
}
