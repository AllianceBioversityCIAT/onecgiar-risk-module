import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { PhasesService } from "src/app/services/phases.service";

export interface DialogData {
  id: number;
}

@Component({
  selector: "app-phase-dialog",
  templateUrl: "./phase-dialog.component.html",
  styleUrls: ["./phase-dialog.component.scss"],
})
export class PhaseDialogComponent implements OnInit {
  phaseId: number = 0;
  phaseForm: FormGroup= new FormGroup('');
  phases: any = [];
  tocPhases: any = [];

  constructor(
    private dialogRef: MatDialogRef<PhaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private phasesService: PhasesService,
    private toastr: ToastrService,
    private fb:FormBuilder
  ) {
    this.phaseId = data.id;
  }

  ngOnInit() {
    this.formInit();
  }

  private async formInit() {
    this.phaseForm =  this.fb.group({
      name: [null, Validators.required],
      reportingYear:  [null, Validators.required],
      tocPhase: [null],
      startDate: [null],
      endDate: [null],
      previousPhase: [null],
      status: [null],
    })
    this.phases = await this.phasesService.getPhases();
    this.tocPhases = await this.phasesService.getTocPhases();
    if (this.phaseId) {
      let { id, previousPhase, ...phaseValues } =
        await this.phasesService.getPhase(this.phaseId);
      this.phaseForm.setValue({
        ...phaseValues,
        previousPhase: previousPhase ? previousPhase.id : null,
      });
    }
  }

  async submit() {
    if (this.phaseForm.valid) {
      await this.phasesService.submitPhase(this.phaseId, this.phaseForm.value);
      this.toastr.success("Phase saved successfully");
      this.dialogRef.close({ submitted: true });
    }
  }
}
