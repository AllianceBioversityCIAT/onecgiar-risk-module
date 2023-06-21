import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MitigationStatus } from 'entities/mitigation-status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MitigationStatusService {
    constructor(
        @InjectRepository(MitigationStatus) private MitigationRepository: Repository<MitigationStatus>,
    ) {}
    async getMitigation() {
        try {
            return await this.MitigationRepository.find({
                order: {
                    title: 'ASC'
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
    async getMitigationById(id: number) {
        try {
            return await this.MitigationRepository.find(
                {
                    where: {id: id}
                });
        } catch (error) {
            console.error(error);
        }
    }
    async addMitigation(data: any) {
        try {
            const Mitigation = new MitigationStatus();
            Mitigation.title = data.title;
            Mitigation.description = data.description;
            return this.MitigationRepository.save(Mitigation);
        } catch (error) {
            console.error(error);
        }
    }

    async updateMitigation(data: any, id: any) {
        try {
            const Mitigation = await this.MitigationRepository.findOne(
                {
                    where: {id: id}
                });
                Mitigation.title = data.title;
                Mitigation.description = data.description;
            return await this.MitigationRepository.save(Mitigation);
        } catch (error) {
            console.error(error);
        }
    }
    async deleteMitigation(id: any) {
        try {
            const Mitigation = await this.MitigationRepository.findOne(
                {
                    where: {id: id}
                });
            return await this.MitigationRepository.remove(Mitigation);
        } catch (error) {
            console.error(error);
        }
    }
}
