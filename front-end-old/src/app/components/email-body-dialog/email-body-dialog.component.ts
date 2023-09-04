import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-email-body-dialog',
  templateUrl: './email-body-dialog.component.html',
  styleUrls: ['./email-body-dialog.component.scss']
})
export class EmailBodyDialogComponent implements OnInit {

 
  dataCoverted: any;
  constructor(
    public dialogRef: MatDialogRef<EmailBodyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer:DomSanitizer
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  ngOnInit(): void {
    this.dataCoverted = this.sanitizer.bypassSecurityTrustHtml(this.data);
  }

}
