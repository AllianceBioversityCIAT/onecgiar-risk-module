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
import { sciencePrograms } from './initiative.entity';
import { Risk } from './risk.entity';
import { User } from './user.entitiy';

@Entity()
export class scienceProgramsRoles {
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
  science_programs_id: number;

  @ManyToOne(() => sciencePrograms, (sciencePrograms) => sciencePrograms.roles)
  @JoinColumn({ name: 'science_programs_id' })
  science_programs: sciencePrograms;

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
  @OneToMany(() => Risk, (risk) => risk.risk_owner,{onUpdate: 'SET NULL', onDelete: 'SET NULL'})
  @JoinTable()
  risks: Array<Risk>;
}
