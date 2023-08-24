export class ActionsControls {
  public id: number;
  public description: string;
  public status: string;

  constructor(id: number, description: string, status: string) {
    this.id = id;
    this.description = description;
    this.status = status;
  }
}
