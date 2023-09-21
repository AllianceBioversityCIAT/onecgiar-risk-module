import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  VirtualColumn,
} from 'typeorm';
import { Initiative } from './initiative.entity';

export enum phaseStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
}

@Entity()
export class Phase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  year: string;

  @Column({ type: 'timestamp' , default:null })
  start_date: Date;

  @Column({ type: 'timestamp' , default:null })
  end_date: Date;

  @Column({ type: 'enum', enum: phaseStatus })
  status: phaseStatus;

  @ManyToOne(() => Phase, (phase) => phase.childPhases, {
    onDelete: 'SET NULL',
  })
  previous_phase: Phase;

  @OneToMany(() => Phase, (phase) => phase.previous_phase, {
    onDelete: 'SET NULL',
  })
  childPhases: Phase[];


  @Column({ default: false })
  active: boolean;


  @OneToMany(() => Initiative, (initiative) => initiative.phase)
  @JoinTable()
  initiatives
}
