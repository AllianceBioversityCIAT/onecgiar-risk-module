import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Glossary } from 'entities/glossary.entity';
import { ILike, Repository } from 'typeorm';
@Injectable()
export class GlossaryService {
    sort(query) {
        if (query?.sort) {
          let obj = {};
          const sorts = query.sort.split(',');
          obj[sorts[0]] = sorts[1];
          return obj;
        } else return { id: 'ASC' };
    }
    constructor(
        @InjectRepository(Glossary)
        private GlossaryRepository: Repository<Glossary>,
      ) {}
    async getGlossary(filters: any) {
        let take = filters.limit;
        let skip=(Number(filters.page)-1)*take;
        const [data, total] =  await this.GlossaryRepository.findAndCount({
            where: {
                title : filters?.title ? ILike(`%${filters?.title}%`) : null,
                firstCharInTitle: filters?.char ? ILike(`%${filters?.char}%`) : null
            },
            take: take,
            skip: skip,
            order: {...this.sort(filters)}
        });
        return {
            result: data,
            count: total
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
