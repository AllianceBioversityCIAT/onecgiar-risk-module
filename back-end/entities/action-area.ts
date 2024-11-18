import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { sciencePrograms } from './initiative.entity';

@Entity()
export class ActionArea {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  name: string;
  @ApiProperty()
  @Column()
  description: string;

  @OneToMany(() => sciencePrograms, (sciencePrograms) => sciencePrograms.action_area)
  @JoinTable()
  science_programs
}
