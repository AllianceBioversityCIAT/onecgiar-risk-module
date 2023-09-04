import { Injectable } from '@angular/core';
import { Published } from 'src/app/shared-model/published-data/published.model';

@Injectable({
  providedIn: 'root',
})
export class ApiPublishedService {
  publishedData: Published[] = [
    new Published(
      2,
      'New change on first risk',
      '10 Jun 2022 | 10:03a.m CEST',
      'Moayad Al-Najdawi'
    ),
    new Published(
      2,
      'New change on first risk',
      '10 Jun 2022 | 10:03a.m CEST',
      'Moayad Al-Najdawi'
    ),
    new Published(
      2,
      'New change on first risk',
      '10 Jun 2022 | 10:03a.m CEST',
      'Moayad Al-Najdawi'
    ),
    new Published(
      2,
      'New change on first risk',
      '10 Jun 2022 | 10:03a.m CEST',
      'Moayad Al-Najdawi'
    ),
    new Published(
      2,
      'New change on first risk',
      '10 Jun 2022 | 10:03a.m CEST',
      'Moayad Al-Najdawi'
    ),
    new Published(
      2,
      'New change on first risk',
      '10 Jun 2022 | 10:03a.m CEST',
      'Moayad Al-Najdawi'
    ),
    new Published(
      2,
      'New change on first risk',
      '10 Jun 2022 | 10:03a.m CEST',
      'Moayad Al-Najdawi'
    ),
    new Published(
      2,
      'New change on first risk',
      '10 Jun 2022 | 10:03a.m CEST',
      'Moayad Al-Najdawi'
    ),
    new Published(
      2,
      'New change on first risk',
      '10 Jun 2022 | 10:03a.m CEST',
      'Moayad Al-Najdawi'
    ),
    new Published(
      2,
      'New change on first risk',
      '10 Jun 2022 | 10:03a.m CEST',
      'Moayad Al-Najdawi'
    ),
  ];
  constructor() {}
}
