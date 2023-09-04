export class MitigationStatus {
  public color: string;
  public id: number;
  public mitigationStatus: string;

  public description: string;

  constructor(
    color: string,
    id: number,
    mitigationStatus: string,

    description: string
  ) {
    this.color = color;
    this.id = id;
    this.mitigationStatus = mitigationStatus;
    this.description = description;
  }
}
