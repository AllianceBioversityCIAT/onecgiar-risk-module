import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  VirtualColumn,
} from 'typeorm';
import { sciencePrograms } from './initiative.entity';

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
  reporting_year: Number;

  @Column({ type: 'date' , default:null })
  start_date: string;

  @Column({ type: 'date' , default:null })
  end_date: string;

  @Column({ type: 'enum', enum: phaseStatus , default: phaseStatus.CLOSED})
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


  @OneToMany(() => sciencePrograms, (sciencePrograms) => sciencePrograms.phase)
  @JoinTable()
  science_programs
}
