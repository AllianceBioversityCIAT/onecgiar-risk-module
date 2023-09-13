import { ApiProperty } from '@nestjs/swagger';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  @Entity()
  export class Glossary {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    title: string;

    @ApiProperty()
    @Column({ type: 'longtext' })
    description: string;
  
    @ApiProperty()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
    
    @ApiProperty()  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ApiProperty()
    @Column()
    firstCharInTitle: string;
 }
  