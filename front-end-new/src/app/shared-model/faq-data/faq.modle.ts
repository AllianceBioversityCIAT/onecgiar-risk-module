export class FAQ {
  public id: number;
  public question: string;
  public answer: string;

  constructor(id: number, question: string, answer: string) {
    this.id = id;
    this.question = question;
    this.answer = answer;
  }
}
