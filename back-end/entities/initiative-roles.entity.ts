import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id;
  @ApiProperty()
  @Column({ nullable: true })
  email: string;
  @ApiProperty()
  @Column({ nullable: true })
  user_id: number;
  @ApiProperty()
  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ApiProperty()
  @Column()
  initiative_id: number;
  @ApiProperty({ type: () => Initiative })
  @ManyToOne(() => Initiative, (initiative) => initiative)
  @JoinColumn({ name: 'initiative_id' })
  initiative: Initiative;
  @ApiProperty()
  @Column()
  role: string;
}
