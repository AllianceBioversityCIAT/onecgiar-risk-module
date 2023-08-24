import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-submit-risk-dialog',
  templateUrl: './submit-risk-dialog.component.html',
  styleUrls: ['./submit-risk-dialog.component.scss'],
})
export class SubmitRiskDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<SubmitRiskDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public submitRiskData: { title: any; element: any }
  ) {}

  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = [
    'Risk 1 | 20',
    'Risk 1 | 20',
    'Risk 1 | 20',
    'Risk 1 | 20',
    'Risk 1 | 20',
    'Risk 1 | 20',
    'Risk 1 | 20',
    'Risk 1 | 20',
    'Risk 1 | 20',
  ];

  ngOnInit() {}
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onPublish() {}
}
