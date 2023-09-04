export class RiskReport {
  public id: number;
  public title: string;
  public category: string;
  public CurrentRiskLevel: number;
  public targetRiskLevel: number;
  public riskOwner: string;
  public createdBy: string;
  public dueDate: string;

  constructor(
    id: number,
    title: string,
    category: string,
    CurrentRiskLevel: number,
    targetRiskLevel: number,
    riskOwner: string,
    createdBy: string,
    dueDate: string
  ) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.CurrentRiskLevel = CurrentRiskLevel;
    this.targetRiskLevel = targetRiskLevel;
    this.riskOwner = riskOwner;
    this.createdBy = createdBy;
    this.dueDate = dueDate;
  }
}
