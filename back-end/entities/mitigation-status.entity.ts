import { ApiProperty } from '@nestjs/swagger';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    JoinTable,
  } from 'typeorm';
import { Mitigation } from './mitigation.entity';
  @Entity()
  export class MitigationStatus {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column({ type: "text" })
    description: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ApiProperty({ type: () => [Mitigation] })
    @OneToMany(() => Mitigation, (mitigation) => mitigation.status, {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    })
    @JoinTable()
    mitigations: Array<Mitigation>;
 }
  