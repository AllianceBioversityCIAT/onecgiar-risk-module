import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-publish-dialog',
  templateUrl: './publish-dialog.component.html',
  styleUrls: ['./publish-dialog.component.scss']
})
export class PublishDialogComponent {

  constructor(
    public fb: FormBuilder
  ) {}


  publishForm: any;
  populatePublishForm() {
    this.publishForm = this.fb.group({
      versionTitle: ['' , Validators.required],
      publishReason: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.populatePublishForm()
  }
}
