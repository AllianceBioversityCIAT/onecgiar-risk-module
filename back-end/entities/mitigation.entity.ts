import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Risk } from './risk.entity';

@Entity()
export class Mitigation {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  risk_id: number;

  @ManyToOne(() => Risk, (risk) => risk.mitigations)
  @JoinColumn({ name: 'risk_id' })
  risk
  @Column()
  description: string;

  @Column()
  status: string;
}
