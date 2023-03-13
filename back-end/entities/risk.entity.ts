import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { Initiative } from './initiative.entity';
import { Mitigation } from './mitigation.entity';
import { RiskCategory } from './risk-category.entity';

@Entity()
export class Risk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  initiative_id: number;

  @ManyToOne(() => Initiative, (initiative) => initiative.risks)
  @JoinColumn({ name: 'initiative_id' })
  initiative: Initiative;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  target_likelihood: number;
  @Column()
  target_impact: number;

  @Column()
  likelihood: number;
  @Column()
  impact: number;

  @ManyToMany(()=> RiskCategory,(riskcat)=>riskcat)
  @JoinTable()
  categories:Array<RiskCategory>

  @OneToMany(()=> Mitigation,(mitigation)=>mitigation.risk)
  @JoinTable()
  mitigations:Array<Mitigation>

}