import { ApiProperty } from '@nestjs/swagger';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
import { Program } from './program.entity';
  @Entity()
  export class Archive {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
    
    @ApiProperty()  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: 'json', nullable: false })
    init_data: string;

    @ApiProperty()
    @Column()
    program_id: number;
    
    @OneToOne(() => Program)
    @JoinColumn({ name: 'program_id' })
    program: Program;

   
}
  