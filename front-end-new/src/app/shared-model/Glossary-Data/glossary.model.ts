export class Glossary {
  public glossaryId: number;
  public termName: string;
  public termDescription: string;

  constructor(glossaryId: number, termName: string, termDescription: string) {
    this.glossaryId = glossaryId;
    this.termName = termName;
    this.termDescription = termDescription;
  }
}
