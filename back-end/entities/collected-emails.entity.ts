import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Risk } from "./risk.entity";
import { sciencePrograms } from "./initiative.entity";

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



    @ManyToOne(() => Risk, (risk) => risk.email)
    @JoinColumn({ name: 'risk_id' })
    risk: Risk;
  
    @ApiProperty()
    @Column()
    risk_id: number;


    @ManyToOne(() => sciencePrograms, (sciencePrograms) => sciencePrograms.email)
    @JoinColumn({ name: 'science_programs_id' })
    science_programs: sciencePrograms;
  
    @ApiProperty()
    @Column()
    science_programs_id: number;


    
    @ApiProperty()
    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date; 
}