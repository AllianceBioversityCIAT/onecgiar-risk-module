import { OmitType, PickType } from "@nestjs/swagger";
import { MitigationStatus } from "entities/mitigation-status.entity";

export class getMitigation extends PickType(MitigationStatus, [
    'id',
    'description',
    'createdAt',
    'updatedAt',
    'title'
]){}

export class createMitigationReq extends PickType(getMitigation, [
    'description',
    'title'
]){}


export class deleteMitigationRes extends OmitType(getMitigation, [
    'id'
]){}
