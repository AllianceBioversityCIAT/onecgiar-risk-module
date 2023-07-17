import { ApiProperty , PickType } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Announcement {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty()
  @Column()
  subject: string;

  @ApiProperty()
  @Column({ type: "text" })
  description: string;

  @ApiProperty()
  @Column({default: false})
  status: boolean;

  @ApiProperty()
  @Column({ type: 'timestamp', default:null })
  sendDate: Date;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamp', default:null })
  updatedAt: Date;
}

// export class CreateAnnouncement extends PickType(Announcement, [
//   'subject',
//   'description',
//   'createdAt'
// ]) {}