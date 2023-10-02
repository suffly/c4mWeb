import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Meetingview } from '@app/models/meetingview';
import { Consulationview } from '@app/models/consulationview';
import { Consulationdetailview } from '@app/models/consulationdetailview';
import { ResponseService } from '@app/services/response.service';
import { Response } from '@app/models/response';

import { ResponselistComponent } from '../responselist/responselist.component';

@Component({
  selector: 'app-response-insertdialog',
  templateUrl: './response-insertdialog.component.html',
  styleUrls: ['./response-insertdialog.component.css']
})
export class ResponseInsertdialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ResponselistComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,
    public ResponseService: ResponseService,

    @Inject(MAT_DIALOG_DATA) public ResponseModel: Response,
  ) {}

  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  Meetingrow:number;
  Counselorrow: number;
  Consulationrow: number;
  Consulationministryrow: number;

  frmGrpAddResponse: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  ngOnInit(): void{
    this.loadData();
    this.frmGrpAddResponse = this.formBuilder.group({
      inputresponse:  new FormControl({value: '', disabled: false}, [Validators.required]),
    });

    if(this.ResponseModel.response_id == undefined)
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
    this.Counselorrow = JSON.parse(localStorage.getItem('counselorview')||'{}');
    this.Consulationrow = JSON.parse(localStorage.getItem('consulationview')||'{}');
    this.Consulationministryrow = JSON.parse(localStorage.getItem('consulationminitryview')||'{}');
    this.loading = false;
  }

  async onSubmit() {
    var responseData = new Response();
    responseData.response_topic = this.frmGrpAddResponse.controls.inputresponse.value;
    if(this.ResponseModel.response_id == undefined)
    {
      responseData.consulationministry_id = this.Consulationministryrow;
      responseData.consulationdetail_id = this.Consulationrow;
      responseData.consulation_id = this.Counselorrow;
      responseData.meeting_id = this.Meetingrow;
      responseData.create_by = 1;
      responseData.create_title = "นาย";
      responseData.create_name = "ทดสอบ";
      responseData.create_surname = "ทดสอบ";
      this.ResponseService.SaveResponse(responseData).subscribe(data => {
        if(data == 0) {this.showWarning('ไม่บันทึกข้อมูลตอบกลับข้อหารือได้');}
        else {this.showSuccess('บันทึกข้อมูลตอบกลับข้อหารือเรียบร้อย');}
      });
    }
    else
    {
      responseData.consulationministry_id = this.ResponseModel.consulationministry_id;
      responseData.consulationdetail_id = this.ResponseModel.consulationdetail_id;
      responseData.consulation_id = this.ResponseModel.consulation_id;
      responseData.meeting_id = this.ResponseModel.meeting_id;
      responseData.create_by = 2;
      responseData.create_title = "นาย";
      responseData.create_name = "ทดสอบ2";
      responseData.create_surname = "ทดสอบ2";
      (await this.ResponseService.UpdateResponse(responseData)).subscribe(data => {
        if(data == 0) { this.showWarning('ไม่แก้ไขข้อมูลตอบกลับข้อหารือ');}
        else {this.showSuccess('แก้ไขข้อมูลตอบกลับข้อหารือเรียบร้อย');}
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
  get f() { return this.frmGrpAddResponse.controls; }

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