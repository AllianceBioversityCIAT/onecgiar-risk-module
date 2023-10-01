import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FAQ } from 'entities/FAQ.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FaqService {
    constructor(
        @InjectRepository(FAQ)
        public FaqRepository: Repository<FAQ>,
      ) {}
    async getFaq() {
        return await this.FaqRepository.find();
    }
    async getFaqById(id: number) {
        try {
            return await this.FaqRepository.findOne({
            where: { id: id },
            });
        } catch (error) {
            console.error(error);
        }
    }
    async addFaq(data: any) {
        try {
            const Faq = new FAQ();
            Faq.question = data.question;
            Faq.answer = data.answer;
            return await this.FaqRepository.save(Faq, { reload: true });
        } catch (error) {
            console.error(error);
        }
    }
    
    async updateFaq(data: any, id: any) {
        try {
            const Faq = await this.FaqRepository.findOne({
            where: { id: id },
            });
            Faq.question = data.question;
            Faq.answer = data.answer;
            return await this.FaqRepository.save(Faq, { reload: true });
        } catch (error) {
            console.error(error);
        }
    }
    async deleteFaq(id: any) {
        try {
            const Faq = await this.FaqRepository.findOne({
                where: {id: id}
            });
            return await this.FaqRepository.remove(Faq);
        } catch (error) {
            console.error(error);
        }
    }
}
