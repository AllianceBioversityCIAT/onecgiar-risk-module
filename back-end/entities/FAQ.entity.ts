import { ApiProperty } from '@nestjs/swagger';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  @Entity()
  export class FAQ {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ type: "text" })
    question: string;

    @ApiProperty()
    @Column({ type: "text" })
    answer: string;
  
    @ApiProperty()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
    
    @ApiProperty()  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
 }
  