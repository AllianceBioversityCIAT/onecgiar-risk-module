export class Announcement {
  public id: number;
  public date: string;
  public time: string;
  public subject: string;
  public message: string;

  constructor(
    id: number,
    date: string,
    time: string,
    subject: string,
    message: string
  ) {
    this.id = id;
    this.date = date;
    this.time = time;
    this.subject = subject;
    this.message = message;
  }
}
