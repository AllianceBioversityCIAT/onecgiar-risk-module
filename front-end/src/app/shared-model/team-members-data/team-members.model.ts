export class TeamMembers {
  public color: string;
  public userId: number;
  public userName: string;
  public email: string;
  public role: string;
  public creationDate: string;

  constructor(
    color: string,
    userId: number,
    userName: string,
    email: string,
    role: string,
    creationDate: string
  ) {
    this.color = color;
    this.userId = userId;
    this.userName = userName;
    this.email = email;
    this.role = role;
    this.creationDate = creationDate;
  }
}
