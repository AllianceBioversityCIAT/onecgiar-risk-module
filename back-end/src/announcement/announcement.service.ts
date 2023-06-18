import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from 'entities/announcement.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AnnouncementService {
    constructor(
        @InjectRepository(Announcement) private AnnouncementRepository: Repository<Announcement>,
    ) {}
    async getAnnouncement() {
        try {
            return await this.AnnouncementRepository.find();
        } catch (error) {
            console.error(error);
        }
    }
    async getAnnouncementById(id: number) {
        try {
            return await this.AnnouncementRepository.find(
                {
                    where: {id: id}
                });
        } catch (error) {
            console.error(error);
        }
    }
    async addAnnouncement(data: any) {
        try {
            const announcement = new Announcement();
            announcement.subject = data.subject;
            announcement.description = data.description;
            announcement.status = data.status;
            return this.AnnouncementRepository.save(announcement);
        } catch (error) {
            console.error(error);
        }
    }

    async updateAnnouncement(data: any, id: any) {
        try {
            const announcement = await this.AnnouncementRepository.findOne(
                {
                    where: {id: id}
                });
            const updatedDate = new Date();
            announcement.updatedAt = updatedDate;
            announcement.subject = data.subject;
            announcement.description = data.description;
            return await this.AnnouncementRepository.save(announcement);
        } catch (error) {
            console.error(error);
        }
    }
    async updateAnnouncementStatus(data: any, id: any) {
        try {
            const announcement = await this.AnnouncementRepository.findOne(
                {
                    where: {id: id}
                });
            const sentDate = new Date();
            announcement.status = !data.status;
            announcement.sendDate = sentDate;
            return await this.AnnouncementRepository.save(announcement);
        } catch (error) {
            console.error(error);
        }
    }
}
