import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Initiative } from './initiative.entity';

export enum phaseStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

@Entity()
export class Phase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  reportingYear: string;

  @Column({ type: 'timestamp' , default:null })
  startDate: Date;

  @Column({ type: 'timestamp' , default:null })
  endDate: Date;

  @Column({ type: 'enum', enum: phaseStatus })
  status: phaseStatus;

  @ManyToOne(() => Phase, (phase) => phase.childPhases, {
    onDelete: 'SET NULL',
  })
  previousPhase: Phase;

  @OneToMany(() => Phase, (phase) => phase.previousPhase, {
    onDelete: 'SET NULL',
  })
  childPhases: Phase[];


  @Column({ default: false })
  active: boolean;


  @OneToMany(() => Initiative, (initiative) => initiative.phase)
  @JoinTable()
  initiatives
}
