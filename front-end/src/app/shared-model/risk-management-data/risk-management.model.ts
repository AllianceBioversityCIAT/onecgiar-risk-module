export class RiskManagement {
  public iNITCode: string;
  public initiativeName: string;
  public riskCategory: string;
  public numOfRisks: number;
  public myRole: string;
  public status: string;
  public helpRequested: string;

  constructor(
    iNITCode: string,
    initiativeName: string,
    riskCategory: string,
    numOfRisks: number,
    myRole: string,
    status: string,
    helpRequested: string
  ) {
    this.iNITCode = iNITCode;
    this.initiativeName = initiativeName;
    this.riskCategory = riskCategory;
    this.numOfRisks = numOfRisks;
    this.myRole = myRole;
    this.status = status;
    this.helpRequested = helpRequested;
  }
}
