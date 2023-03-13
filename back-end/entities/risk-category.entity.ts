import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { Risk } from './risk.entity';

@Entity()
export class RiskCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
  
}