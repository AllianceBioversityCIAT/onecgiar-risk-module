import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { Risk } from './risk.entity';
import { Optional } from '@nestjs/common';
import { CategoryGroup } from './categories-groups';

@Entity()
export class RiskCategory {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({type:'text'})
  description: string;

  @ApiProperty({ type: () => [Risk] })
  @OneToMany(() => Risk, (risk) => risk.science_programs)
  @JoinTable()
  risks: Array<Risk>;
  
  @Optional()
  @Column({default:null})
  category_group_id:number

  @ManyToOne(() => CategoryGroup, (category_group) => category_group.risk_categories)
  @JoinColumn({ name: 'category_group_id' })
  category_group: CategoryGroup;

  @ApiProperty()
  @Column({type: 'bool', default: false})
  disabled: boolean;
}
