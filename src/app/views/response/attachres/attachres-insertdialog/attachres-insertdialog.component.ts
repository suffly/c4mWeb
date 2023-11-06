import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse ,HttpEvent} from '@angular/common/http';

import { ResponsedetailComponent } from '../../responsedetail/responsedetail.component';

import { AttachresService } from '@app/services/attachres.service';
import { Attachresfiles } from '@app/models/attachresfiles';
import { Attachres } from '@app/models/attachres';
import { Userprofile } from '@app/models/userprofile';

@Component({
  selector: 'app-attachres-insertdialog',
  templateUrl: './attachres-insertdialog.component.html',
  styleUrls: ['./attachres-insertdialog.component.css']
})
export class AttachresInsertdialogComponent implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<ResponsedetailComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
    public AttachresService: AttachresService,

    @Inject(MAT_DIALOG_DATA) public AttachresModel: Attachres,
  ) {}
  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  selectedFiles?: FileList;
  currentFile: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  fileAttr = 'เลือกไฟล์';

  frmGrpAttachresUpload: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  Meetingrow:number;
  Counselorrow: number;
  Consulationrow: number;
  Consulationministryrow:number;
  Responserow:number;

  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    this.loadData();
    this.frmGrpAttachresUpload = this.formBuilder.group({
      hidattachres_id: new FormControl(''),
      txtattachres_name: new FormControl({ value: '', disabled: false }, [Validators.required,Validators.maxLength(1000)]),
      txtUploadFile: new FormControl({ value: '', disabled: false }, [Validators.required]),
      txtInputUploadFile: new FormControl({ value: '', disabled: false }, [Validators.required])
    });
  }

  loadData(){
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    this.Meetingrow = JSON.parse(localStorage.getItem('meetingview')||'{}');
    this.Counselorrow = JSON.parse(localStorage.getItem('counselorview')||'{}');
    this.Consulationrow = JSON.parse(localStorage.getItem('consulationview')||'{}');
    this.Consulationministryrow = JSON.parse(localStorage.getItem('consulationminitryview')||'{consulationminitryview}')
    this.Responserow = JSON.parse(localStorage.getItem('response')||'{}');

  }

  async onSubmit() {
    if(this.frmGrpAttachresUpload.invalid){return;}
    this.progress = 0;
    var attachresData = new Attachresfiles();
    attachresData.attachres_name = this.frmGrpAttachresUpload.controls["txtattachres_name"].value;
    attachresData.files = this.currentFile;

    if(this.AttachresModel.attachres_id == undefined)
    {
      attachresData.response_id = this.Responserow;
      attachresData.consulationministry_id = this.Consulationministryrow;
      attachresData.consulationdetail_id = this.Consulationrow;
      attachresData.consulation_id = this.Counselorrow;
      attachresData.meeting_id = this.Meetingrow;
      attachresData.upload_by = this.currentUser.user_id;
      (await this.AttachresService.Upload_Attachres(attachresData)).subscribe({
        next: (event:any) => {
        if(event.type === HttpEventType.UploadProgress){
          this.progress = Math.round(100* event.loaded/event.total);
        }
        else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          if (this.message == 'Success') {
            this.showSuccess('บันทึกเอกสารเรียบร้อย');
            this.dialogRef.close(1);
          } else {
              this.showWarning('ไม่สามารถบันทึกเอกสารได้');
              this.dialogRef.close(0);
          }
        }},
        error: (err: any) => {
          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }
          this.showWarning('ไม่สามารถบันทึกแก้ไขเอกสารได้ : ' + this.message);
          this.dialogRef.close(0);
        }}
      );
    }
    else
    {
      attachresData.response_id = this.AttachresModel.response_id;
      attachresData.consulationministry_id = this.AttachresModel.consulationministry_id;
      attachresData.consulationdetail_id = this.AttachresModel.consulationdetail_id;
      attachresData.consulation_id = this.AttachresModel.consulation_id;
      attachresData.meeting_id = this.AttachresModel.meeting_id;
      attachresData.upload_by = 2;
      this.dialogRef.close(0);
      this.showWarning("ไม่สามารถอัพโหลดเอกสารได้");
    }

  }

  onSelectFile(files: any, fileType: string): void {
    let fileList = (<HTMLInputElement>files.target).files;
    if (fileList && fileList.length > 0) {
      let file: File = fileList[0];
      this.frmGrpAttachresUpload.controls["txtUploadFile"].setValue(file);
      this.fileAttr = file.name;
      this.currentFile = file;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
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
