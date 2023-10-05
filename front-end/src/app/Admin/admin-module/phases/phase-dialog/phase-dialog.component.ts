import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import * as moment from "moment";
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
  phaseForm: FormGroup = new FormGroup('');
  phases: any = [];
  tocPhases: any = [];

  constructor(
    private dialogRef: MatDialogRef<PhaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private phasesService: PhasesService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.phaseId = data.id;
  }

  ngOnInit() {
    this.formInit();
  }

  private async formInit() {
    this.phaseForm = this.fb.group({
      name: [null, Validators.required],
      reporting_year: [null, Validators.required],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      previous_phase: [null],
      status: [null, Validators.required],
    });
    this.phases = await this.phasesService.getPhases(null, null, null);
    this.tocPhases = await this.phasesService.getTocPhases();
    if (this.phaseId) {
      let { id, previous_phase, active, ...phaseValues } =
        await this.phasesService.getPhase(this.phaseId);
      this.phaseForm.setValue({
        ...phaseValues,
        previous_phase: previous_phase ? previous_phase.id : null,
      });
    }
  }

  async submit() {
      const startDate = this.phaseForm.value.start_date;
      const endDate = this.phaseForm.value.end_date;
      let startDateToDB = moment(startDate).format("YYYY-MM-DD");
      let endDateToDB = moment(endDate).format("YYYY-MM-DD");
      this.phaseForm.controls['start_date'].patchValue(startDateToDB);
      this.phaseForm.controls['end_date'].patchValue(endDateToDB);
      
    if (this.phaseForm.valid) {
      await this.phasesService.submitPhase(this.phaseId, this.phaseForm.value);
      this.toast.success("Phase saved successfully");
      this.dialogRef.close({ submitted: true });
    }
  }


  
  //Close-Dialog
  onCloseDialog() {
    this.dialogRef.close();
  }
}
