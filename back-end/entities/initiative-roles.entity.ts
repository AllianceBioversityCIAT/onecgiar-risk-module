import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Initiative } from './initiative.entity';
import { User } from './user.entitiy';

@Entity()
export class InitiativeRoles {
  @PrimaryGeneratedColumn()
  id;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user:User

  @Column()
  initiative_id: number;

  @ManyToOne(() => Initiative, (initiative) => initiative)
  @JoinColumn({ name: 'initiative_id' })
  initiative: Initiative;

  @Column()
  role: string;
}
