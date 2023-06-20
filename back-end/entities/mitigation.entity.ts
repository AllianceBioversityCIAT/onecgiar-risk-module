import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Risk } from './risk.entity';
import { MitigationStatus } from './mitigation-status.entity';

@Entity()
export class Mitigation {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  risk_id: number;
  @ManyToOne(() => Risk, (risk) => risk.mitigations,{onUpdate:'CASCADE',onDelete:'CASCADE'})
  @JoinColumn({ name: 'risk_id' })
  risk: Risk;
  @ApiProperty()
  @Column({type:'text'})
  description: string;

  @ApiProperty()
  @Column()
  mitigation_status_id: number;

  @ManyToOne(() => MitigationStatus, (mitigation_status) => mitigation_status.mitigations,{onUpdate:'CASCADE',onDelete:'CASCADE'})
  @JoinColumn({ name: 'mitigation_status_id' })
  status: MitigationStatus;
}
