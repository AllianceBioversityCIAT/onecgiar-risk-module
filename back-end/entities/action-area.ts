import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { Initiative } from './initiative.entity';

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

  @OneToMany(() => Initiative, (initiative) => initiative.action_area)
  @JoinTable()
  initiatives
}
