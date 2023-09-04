import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-general-tabel',
  templateUrl: './general-tabel.component.html',
  styleUrls: ['./general-tabel.component.scss'],
})
export class GeneralTabelComponent implements OnInit {
  constructor() {}
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() changePage: EventEmitter<any> = new EventEmitter<any>();

  displayedColumns: string[] = [];
  @Input() actions:any = []
  @Input() userTable:boolean = false;
  @Input() pageSize! : number;
  @Input() length! : number;
  @Input() pageSizeOptions: number[] = [10, 15, 50, 100];
  ngOnInit(): void {
    console.log(this.actions);
    this.displayedColumns = this.columns.map((d: any) => d.name);
    if (this.actions.length) this.displayedColumns.push('actions');
  }

  @Input() dataSource: any;
  @Input() columns: any = [];
  pagination(event: PageEvent) {
    this.changePage.emit(event);
  }
  action(act: any, item: any) {
    this.actionEvent.emit({ act, item });
  }
}
