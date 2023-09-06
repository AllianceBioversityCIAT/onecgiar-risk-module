import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-send-test',
  templateUrl: './send-test.component.html',
  styleUrls: ['./send-test.component.scss']
})
export class SendTestComponent {
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SendTestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  sendEmailForm = this.fb.group({
    id: this.fb.control(this.data.id),
    email: this.fb.control('', [Validators.required, Validators.email]),
  });

  onSubmit() {
    if (this.sendEmailForm.valid) {
      this.dialogRef.close(this.sendEmailForm.value);
    }
  }
  onClose() {
    this.dialog.closeAll();
  }
}
