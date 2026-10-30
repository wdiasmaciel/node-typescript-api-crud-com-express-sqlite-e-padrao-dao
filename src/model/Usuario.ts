export class Usuario {
  public id: number;
  public nome: string;
  public nascimento: string | null;
  
  constructor(id: number, nome: string, nascimento: string | null) {
    this.id = id;
    this.nome = nome;
    this.nascimento = nascimento;
  }
}
