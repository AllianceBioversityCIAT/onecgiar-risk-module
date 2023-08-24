export class Category {
  public color: string;
  public id: number;
  public category: string;
  public categoryGroup: string;
  public description: string;

  constructor(
    color: string,
    id: number,
    category: string,
    categoryGroup: string,
    description: string
  ) {
    this.color = color;
    this.id = id;
    this.category = category;
    this.categoryGroup = categoryGroup;
    this.description = description;
  }
}
