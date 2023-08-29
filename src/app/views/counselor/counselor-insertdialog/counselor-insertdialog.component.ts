import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CounselorviewlistComponent } from '../counselorviewlist/counselorviewlist.component';

import { Meetingview } from 'src/app/models/meetingview';
import { CounselorviewService } from '@app/services/counselorview.service';
import { Counselorview } from '@app/models/counselorview';
import { ConsulationviewService } from '@app/services/consulationview.service';
import { Consulationview } from '@app/models/consulationview';
import { Consulation } from '@app/models/consulation';
import { ConsulationService } from '@app/services/consulation.service';

@Component({
  selector: 'app-counselor-insertdialog',
  templateUrl: './counselor-insertdialog.component.html',
  styleUrls: ['./counselor-insertdialog.component.css']
})
export class CounselorInsertdialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CounselorviewlistComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,

    public CounselorviewService: CounselorviewService,
    public ConsulationviewService: ConsulationviewService,
    public ConsulationService: ConsulationService,
    
    @Inject(MAT_DIALOG_DATA) public ConsulationviewModel: Consulationview,
  ) {}

  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  Meetingrow:Meetingview;

  CounselorviewModel: Counselorview[];

  frmGrpAddCounselor: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';


  ngOnInit(): void {
    this.loadData();
    this.frmGrpAddCounselor = this.formBuilder.group({
      ddlcounselor: new FormControl({value: '', disabled: false}, [Validators.required])
    });
    if(this.ConsulationviewModel.counselor_id == undefined)
    {
      this.editable = false;
    }
    else
    {
      this.editable = true;
    }
  }

  loadData() {
    this.loading = true;
    this.Meetingrow = JSON.parse(localStorage.getItem('meetingview')||'{}');
    var Counselor = new Counselorview();
    this.CounselorviewService.GetCounselorviewActive(Counselor).subscribe(data => {this.CounselorviewModel = data});
    this.loading = false;
  }

  async onSubmit() {
    console.log("onSubmit");
    if (this.frmGrpAddCounselor.invalid){return;}
    var consulationData = new Consulation();    
    consulationData.counselor_id = this.frmGrpAddCounselor.controls.ddlcounselor.value;
    if (this.ConsulationviewModel.consulation_id == undefined)
    {
      consulationData.meeting_id = this.Meetingrow.meeting_id;
      consulationData.create_by = 1;
      this.ConsulationService.SaveConsulation(consulationData).subscribe(data => {
        if (data == 0) {this.showWarning('ไม่บันทึกผู้หารือได้');}
        else {this.showSuccess('บันทึกผู้หารือเรียบร้อย');}
      });
    }
    else
    {
      consulationData.update_by = 2;
      consulationData.consulation_id = this.ConsulationviewModel.consulation_id;
      consulationData.meeting_id = this.ConsulationviewModel.meeting_id;
      consulationData.count_consulationdetail = this.ConsulationviewModel.count_consulationdetail;
      consulationData.create_date = this.ConsulationviewModel.create_date;
      consulationData.create_by = this.ConsulationviewModel.create_by;

      (await this.ConsulationService.UpdateConsulation(consulationData)).subscribe(data => {
        if (data == 0) {this.showWarning('ไม่แก้ไขผู้หารือได้');}
        else {this.showSuccess('แก้ไขผู้หารือเรียบร้อย');}
      });
    }
  }

  onNoClick(): void {
    console.log("closeDialog");
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Success', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
    this._snackBar.open(message, 'Warning', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  get f() { return this.frmGrpAddCounselor.controls; }

  refresh(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  showSuccess(message: string) {
    this.toastr.success(message);
  }

  showWarning(message: string) {
    this.toastr.warning(message);
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}