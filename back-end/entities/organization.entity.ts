import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
import { Program } from './program.entity';
  
  @Entity()
  export class Organization {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    code: string;
  
    @ApiProperty()
    @Column()
    name: string;
  
    @ApiProperty()
    @Column()
    acronym: string;
  
    @ManyToMany(() => Program, (program) => program.organizations)
    program: Program[];
  
  }
  