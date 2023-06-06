import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-general-tabel',
  templateUrl: './general-tabel.component.html',
  styleUrls: ['./general-tabel.component.scss'],
})
export class GeneralTabelComponent implements OnInit {
  constructor() {}
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();
  displayedColumns: string[] = [];
  @Input() actions:any = []
  ngOnInit(): void {
    console.log(this.actions);
    this.displayedColumns = this.columns.map((d: any) => d.name);
    if (this.actions.length) this.displayedColumns.push('actions');
  }

  @Input() dataSource: any;
  @Input() columns: any = [];

  action(act: any, item: any) {
    this.actionEvent.emit({ act, item });
  }
}
