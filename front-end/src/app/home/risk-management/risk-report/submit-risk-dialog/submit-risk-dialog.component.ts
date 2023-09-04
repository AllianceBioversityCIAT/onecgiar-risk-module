import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InitiativesService } from 'src/app/services/initiatives.service';

@Component({
  selector: 'app-submit-risk-dialog',
  templateUrl: './submit-risk-dialog.component.html',
  styleUrls: ['./submit-risk-dialog.component.scss'],
})
export class SubmitRiskDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SubmitRiskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private initiativeService: InitiativesService
  ) {}
  tops: any = null;
  error: any[] = [];

  async ngOnInit() {
    this.tops = await this.initiativeService.getTopRisks(
      this.data.initiative_id
    );
    this.top = this.tops.top as [];
    this.similar = this.tops.similar as [];
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
  async publish() {
    this.error = [];
    // case 1
    if(this.tops.top.length + this.tops.similar.length <= 5) {
        this.dialogRef.close(this.data);
    }
    //case 2
    if(this.tops.top.length + this.tops.similar.length > 5) {

      if(this.tops.top.length < 5) {
        this.error.push("please make sure that you have selected the top 5 risks");
      }

      if(this.tops.top.length == 5) {
        let current_level_for_top = this.tops.top.map((d: { current_level: any; }) => d.current_level);
        let current_level_for_similar = this.tops.similar.map((d: { current_level: any; }) => d.current_level);
  
        let similarHaveLevelMoreTop: any[] = [];
  
        current_level_for_top.map((current_top: any) => {
          current_level_for_similar.map((current_similar: any) => {
            if(current_top < current_similar) {
              similarHaveLevelMoreTop.push(current_similar);
            }
          })
        })
  
        if(similarHaveLevelMoreTop.length == 0 && this.error.length == 0){
          this.dialogRef.close(this.data);
        }
        else if(similarHaveLevelMoreTop.length != 0){
          this.error.push("please make sure that you have selected the top 5 risks");
        }
      }
    }
  }
  toparray = [];

  similararray = [];

  top: any[] = [];

  similar: any[] = [];
  evenPredicate(item: any): any {
    return this.data?.length < 5;
  }

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

    this.data.top = this.top;
  }




  // //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }


}
