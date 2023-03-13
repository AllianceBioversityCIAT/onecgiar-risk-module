import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Risk } from 'entities/risk.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RiskService {

    constructor( @InjectRepository(Risk)
    public riskRepository: Repository<Risk>){

        
    }
}
