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
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss'],
})
export class GlossaryComponent implements OnInit {
  [x: string]: any;
  glossaryData: Glossary[] = [];
  constructor(
    private apiGlossary: ApiGlossaryService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  obs!: Observable<any>;
  dataSource: MatTableDataSource<Glossary> = new MatTableDataSource<Glossary>(
    this.glossaryData
  );

  termCtrl = new FormControl('');

  glossary: string[] = [];

  @ViewChild('termInput')
  termInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  ngOnInit() {
    this.dataSource.data = this.apiGlossary.glossaryData;

    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.glossary.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.termCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.glossary.indexOf(fruit);
    if (index >= 0) {
      this.glossary.splice(index, 1);
      this.announcer.announce(`Removed ${fruit}`);
    }
  }

  activeButton = '';

  character = [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'A',
      value: 'a',
    },
    {
      name: 'B',
      value: 'b',
    },
    {
      name: 'C',
      value: 'c',
    },
    {
      name: 'D',
      value: 'd',
    },
    {
      name: 'E',
      value: 'e',
    },
    {
      name: 'F',
      value: 'f',
    },
    {
      name: 'G',
      value: 'g',
    },
    {
      name: 'H',
      value: 'h',
    },
    {
      name: 'I',
      value: 'i',
    },
    {
      name: 'J',
      value: 'j',
    },
    {
      name: 'K',
      value: 'k',
    },
    {
      name: 'L',
      value: 'l',
    },
    {
      name: 'M',
      value: 'm',
    },
    {
      name: 'N',
      value: 'n',
    },
    {
      name: 'O',
      value: 'o',
    },
    {
      name: 'P',
      value: 'p',
    },
    {
      name: 'Q',
      value: 'q',
    },
    {
      name: 'R',
      value: 'r',
    },
    {
      name: 'S',
      value: 's',
    },
    {
      name: 'T',
      value: 't',
    },
    {
      name: 'U',
      value: 'u',
    },
    {
      name: 'V',
      value: 'v',
    },
    {
      name: 'W',
      value: 'w',
    },
    {
      name: 'X',
      value: 'x',
    },
    {
      name: 'Y',
      value: 'y',
    },
    {
      name: 'Z',
      value: 'z',
    },
  ];

  showPhase(event: any) {
    this.activeButton = event;
  }

  // selected(event: MatAutocompleteSelectedEvent): void {
  //   this.fruits.push(event.option.viewValue);
  //   this.fruitInput.nativeElement.value = '';
  //   this.fruitCtrl.setValue(null);
  // }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.fruits.filter((fruit) =>
  //     fruit.toLowerCase().includes(filterValue)
  //   );
  // }
}
