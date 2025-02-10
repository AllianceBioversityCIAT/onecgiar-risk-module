import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'entities/organization.entity';
import { ILike, In, Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Program } from 'entities/program.entity';

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectRepository(Organization)
        private organizationRepository: Repository<Organization>,
        @InjectRepository(Program)
        private programRepository: Repository<Program>,
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

    async getOrganizationsProgram(program_id: number) {
        const data = await this.organizationRepository.find({
            where: {
                program: {
                    id: program_id
                }
            },
        });
        return data;
    }


    async assignOrgs(data: any) {
        const { organizationsIds, program_id } = data;

        const program = await this.programRepository.findOne({
            where: {
                id: program_id
            },
            relations: ['organizations']
        });

        const organizations = await this.organizationRepository.find({
            where: {
                code: In(organizationsIds)
            }
        });

        program.organizations = organizations;

        return this.programRepository.save(program);
    }
}
