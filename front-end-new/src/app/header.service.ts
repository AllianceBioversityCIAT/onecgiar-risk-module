import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  background: string = '#0f212f';
  
  backgroundNavMain: string = '#436280';



  backgroundUserNavButton:string='#436280';
  constructor() {}
}
