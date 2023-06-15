import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Variables } from 'entities/variables.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VariablesService {
    constructor(  @InjectRepository(Variables)
    public variablesRepository: Repository<Variables>,){}
}
