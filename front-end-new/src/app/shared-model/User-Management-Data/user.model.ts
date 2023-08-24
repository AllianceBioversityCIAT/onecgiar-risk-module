export class User {
  public color: string;
  public userId: number;
  public userName: string;
  public email: string;
  public role: string;

  constructor(
    color: string,
    userId: number,
    userName: string,
    email: string,
    role: string
  ) {
    this.color = color;
    this.userId = userId;
    this.userName = userName;
    this.email = email;
    this.role = role;
  }
}
