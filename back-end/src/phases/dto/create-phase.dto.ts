export enum phaseStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
}

export class CreatePhaseDto {
  id: number;

  name: string;

  year: string;

  start_date: string;

  end_date: string;

  status: phaseStatus;
}
