import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Risk } from "./risk.entity";
import { Program } from "./program.entity";

@Entity()
export class CollectedEmail {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number; 

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    subject: string;

    @ApiProperty()
    @Column()
    email: string;

    @ApiProperty()
    @Column({default: false})
    status: boolean;

    @ApiProperty()
    @Column()
    variable_id: number;



    @ManyToOne(() => Risk, (risk) => risk.email, {onUpdate:'CASCADE',onDelete: 'CASCADE'})
    @JoinColumn({ name: 'risk_id' })
    risk: Risk;
  
    @ApiProperty()
    @Column()
    risk_id: number;


    @ManyToOne(() => Program, (program) => program.email , {onUpdate:'CASCADE',onDelete: 'CASCADE'})
    @JoinColumn({ name: 'program_id' })
    program: Program;
  
    @ApiProperty()
    @Column()
    program_id: number;


    
    @ApiProperty()
    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date; 
}