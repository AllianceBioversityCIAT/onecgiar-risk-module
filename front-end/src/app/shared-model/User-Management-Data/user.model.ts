export class User {
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
    this.userId = userId;
    this.userName = userName;
    this.email = email;
    this.role = role;
  }
}
