import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Risk } from './risk.entity';

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
  @Column()
  description: string;
  @ApiProperty()
  @Column()
  status: string;
  
}
