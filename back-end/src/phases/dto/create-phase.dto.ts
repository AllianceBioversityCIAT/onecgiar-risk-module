export enum phaseStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export class CreatePhaseDto {
  id: number;

  name: string;

  reportingYear: string;

  tocPhase: string;

  startDate: string;

  endDate: string;

  status: phaseStatus;
}
