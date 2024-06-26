import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Email {
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
    @Column('longtext')
    emailBody: string; 

    @ApiProperty()
    @Column({default: false})
    status: boolean;

    @ApiProperty()
    @Column({ nullable: true })
    variable_id: number;

    
    @ApiProperty()
    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date; 
}