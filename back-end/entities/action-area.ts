import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { Program } from './initiative.entity';

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

  @OneToMany(() => Program, (program) => program.action_area)
  @JoinTable()
  program
}
