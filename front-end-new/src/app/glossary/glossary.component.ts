import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { ApiGlossaryService } from '../shared-services/glossary-services/api-glossary.service';
import { Glossary } from '../shared-model/Glossary-Data/glossary.model';
import { MatChipInputEvent } from '@angular/material/chips';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Observable } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GlossaryService } from '../services/glossary.service';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss'],
})
export class GlossaryComponent implements OnInit {



  constructor(
    private glossaryService: GlossaryService,
    // private changeDetectorRef: ChangeDetectorRef
  ) {}
  filters: any;
  length: number = 0;
  pageSize: number = 5;
  pageIndex: number = 1;
  data: any;
  glossary: any;

  changeFilter() {
    this.form.valueChanges.subscribe(async filtersValue => {
      this.filters = filtersValue;
      await this.getData(this.filters)
    });
  }
  async ngOnInit(): Promise<void> {
    this.changeFilter()
    await this.getData(this.filters);
    // this.changeDetectorRef.detectChanges();
  }

  async getData(filters: any) {
    this.pageIndex = 1;
    this.data = await this.glossaryService.getGlossary(filters,this.pageIndex,this.pageSize);
    this.glossary = this.data.result;
    this.length = this.data.count;
  }



  async pagination(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.data = await this.glossaryService.getGlossary(this.filters,++this.pageIndex , this.pageSize);
    this.glossary = this.data.result;
    this.length = this.data.count;
  }
  alphabet = [
    {character: 'All', value : ''},
    {character: 'A', value : 'a'},
    {character: 'B', value : 'b'},
    {character: 'C', value : 'c'},
    {character: 'D', value : 'd'},
    {character: 'E', value : 'e'},
    {character: 'F', value : 'f'},
    {character: 'G', value : 'g'},
    {character: 'H', value : 'h'},
    {character: 'I', value : 'i'},
    {character: 'J', value : 'j'},
    {character: 'K', value : 'k'},
    {character: 'L', value : 'l'},
    {character: 'M', value : 'm'},
    {character: 'N', value : 'n'},
    {character: 'O', value : 'o'},
    {character: 'P', value : 'p'},
    {character: 'Q', value : 'q'},
    {character: 'R', value : 'r'},
    {character: 'S', value : 's'},
    {character: 'T', value : 't'},
    {character: 'U', value : 'u'},
    {character: 'V', value : 'v'},
    {character: 'W', value : 'w'},
    {character: 'X', value : 'x'},
    {character: 'Y', value : 'y'},
    {character: 'Z', value : 'z'}
  ];


  form = new FormGroup({
    search: new FormControl(''),
    char: new FormControl('')
 });


 setCharValue(char: string) {
  this.form.controls['char'].setValue(char);
 }
  activeButton = '';


  showPhase(event: any) {
    this.activeButton = event;
  }
}
