export class Published {
  public versionId: number;
  public versionTitle: string;
  public creationDate: string;
  public creationBy: string;

  constructor(
    versionId: number,
    versionTitle: string,
    creationDate: string,
    creationBy: string
  ) {
    this.versionId = versionId;
    this.versionTitle = versionTitle;
    this.creationDate = creationDate;
    this.creationBy = creationBy;
  }
}
