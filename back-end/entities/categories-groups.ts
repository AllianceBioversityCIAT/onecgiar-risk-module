import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { RiskCategory } from './risk-category.entity';

@Entity()
export class CategoryGroup {
  
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @OneToMany(() => RiskCategory, (riskCategory) => riskCategory.category_group)
  @JoinTable()
  risk_categories: RiskCategory;


}
