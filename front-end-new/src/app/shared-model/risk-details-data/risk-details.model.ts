export class RiskDetails {
  public iNITCode: string;
  public initiativeName: string;
  public riskCategory: string[];
  public risk: string[];
  public riskDescription: string[];
  public riskScore: number[];

  constructor(
    iNITCode: string,
    initiativeName: string,
    riskCategory: string[],
    risk: string[],
    riskDescription: string[],
    riskScore: number[]
  ) {
    this.iNITCode = iNITCode;
    this.initiativeName = initiativeName;
    this.riskCategory = riskCategory;
    this.risk = risk;
    this.riskDescription = riskDescription;
    this.riskScore = riskScore;
  }
}
