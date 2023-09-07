import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Glossary } from 'entities/glossary.entity';
import { ILike, Repository } from 'typeorm';
@Injectable()
export class GlossaryService {
    constructor(
        @InjectRepository(Glossary)
        private GlossaryRepository: Repository<Glossary>,
      ) {}
    async getGlossary(filters: any) {
        if(filters.page == 'null' && filters.limit == 'null') {
            let result=  await this.GlossaryRepository.find();
            return result;
        }
        else {
            let take = filters.limit;
            let skip=(Number(filters.page)-1)*take;
            const [data, total] =  await this.GlossaryRepository.findAndCount({
                where: {
                    title : filters?.search ? ILike(`%${filters?.search}%`) : null,
                    firstCharInTitle: filters?.char ? ILike(`%${filters?.char}%`) : null
                },
                take: take,
                skip: skip,
                order: {title: 'ASC'}
            });
            return {
                result: data,
                count: total
            }
        }
    }
    async getGlossaryById(id: number) {
        try {
            return await this.GlossaryRepository.findOne({
            where: { id: id },
            });
        } catch (error) {
            console.error(error);
        }
    }
    async addGlossary(data: any) {
        try {
            const glossary = new Glossary();
            glossary.title = data.title;
            glossary.description = data.description;
            glossary.firstCharInTitle = data?.title?.charAt(0);
            return await this.GlossaryRepository.save(glossary, { reload: true });
        } catch (error) {
            console.error(error);
        }
    }
    
    async updateGlossary(data: any, id: any) {
        try {
            const glossary = await this.GlossaryRepository.findOne({
            where: { id: id },
            });
            glossary.title = data.title;
            glossary.description = data.description;
            glossary.firstCharInTitle = data?.title?.charAt(0);
            return await this.GlossaryRepository.save(glossary, { reload: true });
        } catch (error) {
            console.error(error);
        }
    }
    async deleteGlossary(id: any) {
        try {
            const glossary = await this.GlossaryRepository.findOne(
                {
                    where: {id: id}
                });
            return await this.GlossaryRepository.remove(glossary);
        } catch (error) {
            console.error(error);
        }
    }
}
