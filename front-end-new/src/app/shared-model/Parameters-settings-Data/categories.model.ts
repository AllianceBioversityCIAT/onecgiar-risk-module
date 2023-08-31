export class Category {
 
  public id: number;
  public category: string;
  public categoryGroup: string;
  public description: string;

  constructor(
   
    id: number,
    category: string,
    categoryGroup: string,
    description: string
  ) {
   
    this.id = id;
    this.category = category;
    this.categoryGroup = categoryGroup;
    this.description = description;
  }
}
