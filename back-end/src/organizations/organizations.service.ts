import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'entities/organization.entity';
import { ILike, Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PhaseProgramOrganization } from 'entities/phase-program-organization.entity';

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectRepository(Organization)
        private organizationRepository: Repository<Organization>,
        @InjectRepository(PhaseProgramOrganization)
        private phaseProgramOrganizationRepository: Repository<PhaseProgramOrganization>,
    ) { }


    async create(createOrganizationDto: CreateOrganizationDto) {
        let orgExist = await this.organizationRepository.findOneBy({
            code: createOrganizationDto.code,
        });

        if (orgExist) {
            throw new BadRequestException(
                'Organization code already exist.',
            );
        }

        const newOrganization = this.organizationRepository.create({
            ...createOrganizationDto,
        });
        return this.organizationRepository.save(newOrganization);
    }

    async findAll(query: any) {
        return await this.organizationRepository.find({
            where: {
                name: query?.name ? ILike(`%${query?.name}%`) : null,
            },
            order: {
                acronym: 'ASC'
            }
        });
    }

    findOne(code: any) {
        return this.organizationRepository.findOneBy({ code });
    }



    async update(code: any, updateOrganizationDto: UpdateOrganizationDto) {
        if (code != updateOrganizationDto.code) {
            let orgExist = await this.organizationRepository.findOneBy({
                code: updateOrganizationDto.code,
            });

            if (orgExist) {
                throw new BadRequestException('Organization code already exist.');
            }
        }

        return this.organizationRepository.update(
            { code },
            { ...updateOrganizationDto },
        );
    }

    async remove(code: any) {
        const orgUsed = await this.organizationRepository.findOne({
            where: {
                code: code
            },
            relations: ['program']
        });
        if (orgUsed.program.length != 0) {
            throw new BadRequestException('Organization cannot be deleted, This organization is assigned for an Program(s)')
        } else {
            return this.organizationRepository.delete({ code });
        }
    }

    async getOrganizationsProgram(program_id: number, phase_id: number) {
        const data = await this.phaseProgramOrganizationRepository.find({
            where: {
                phase_id: phase_id,
                program_id: program_id
            },
            relations: ['organization']
        });
        return data.map((d: any) => d.organization);
    }


    async assignOrgs(data: any) {
        const { organizations, program_id, phase_id } = data;

        await this.phaseProgramOrganizationRepository.delete({
            phase_id,
            program_id,
        });
        for (const code of organizations) {
            const newPhaseProgOrg = this.phaseProgramOrganizationRepository.create({
                phase_id,
                program_id,
                organization_code: code,
            });
            await this.phaseProgramOrganizationRepository.save(newPhaseProgOrg);
        }
        return true;
    }
}
