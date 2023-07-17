import { PickType } from "@nestjs/swagger";
import { User } from "entities/user.entitiy";

export class getUsers extends PickType(User, 
    [
    'id',
    'email',
    'first_name',
    'last_name',
    'full_name',
    'role'
    ]){}


export class createAndUpdateUsers extends PickType(getUsers, 
    [
    'id',
    'email',
    'first_name',
    'last_name',
    'role'
    ]){}

export class exportToExcel {
    user: Array<getUsers>
}