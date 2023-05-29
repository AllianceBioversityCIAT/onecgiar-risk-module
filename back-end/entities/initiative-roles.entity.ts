import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Initiative } from './initiative.entity';
import { Risk } from './risk.entity';
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

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ApiProperty()
  @Column()
  initiative_id: number;

  @ManyToOne(() => Initiative, (initiative) => initiative)
  @JoinColumn({ name: 'initiative_id' })
  initiative: Initiative;

  @ApiProperty()
  @Column()
  role: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({ type: () => [Risk] })
  @OneToMany(() => Risk, (risk) => risk.risk_owner)
  @JoinTable()
  risks: Array<Risk>;
}
