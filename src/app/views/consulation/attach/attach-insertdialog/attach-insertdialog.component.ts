import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse ,HttpEvent} from '@angular/common/http';

import { ConsulationviewdetailComponent } from '../../consulationviewdetail/consulationviewdetail.component';

import { AttachService } from '@app/services/attach.service';
import { Attachfiles } from '@app/models/attachfiles';
import { Attach } from '@app/models/attach';

@Component({
  selector: 'app-attach-insertdialog',
  templateUrl: './attach-insertdialog.component.html',
  styleUrls: ['./attach-insertdialog.component.css']
})
export class AttachInsertdialogComponent implements OnInit {

  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  selectedFiles?: FileList;
  currentFile: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  fileAttr = 'เลือกไฟล์';

  frmGrpAttachUpload: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  Meetingrow:number;
  Counselorrow: number;
  Consulationrow: number;

  constructor(
    public dialogRef: MatDialogRef<ConsulationviewdetailComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
    public AttachService: AttachService,

    @Inject(MAT_DIALOG_DATA) public AttachModel: Attach,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.loadData();
    this.frmGrpAttachUpload = this.formBuilder.group({
      hidattach_id: new FormControl(''),
      txtattach_name: new FormControl({ value: '', disabled: false }, [Validators.required,Validators.maxLength(1000)]),
      txtUploadFile: new FormControl({ value: '', disabled: false }, [Validators.required]),
      txtInputUploadFile: new FormControl({ value: '', disabled: false }, [Validators.required])
    });
  }

  loadData(){
    this.Meetingrow = JSON.parse(localStorage.getItem('meetingview')||'{}');
    this.Counselorrow = JSON.parse(localStorage.getItem('counselorview')||'{}');
    this.Consulationrow = JSON.parse(localStorage.getItem('consulationview')||'{}');
  }

  async onSubmit() {
    if(this.frmGrpAttachUpload.invalid){return;}
    this.progress = 0;
    var attachData = new Attachfiles();
    attachData.attach_name = this.frmGrpAttachUpload.controls["txtattach_name"].value;
    attachData.files = this.currentFile;
    
    if(this.AttachModel.attach_id == undefined)
    {
      attachData.consulationdetail_id = this.Consulationrow;
      attachData.consulation_id = this.Counselorrow;
      attachData.meeting_id = this.Meetingrow;
      attachData.upload_by = 1;
      (await this.AttachService.Upload_Attach(attachData)).subscribe({
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
      attachData.consulationdetail_id = this.AttachModel.consulationdetail_id;
      attachData.consulation_id = this.AttachModel.consulation_id;
      attachData.meeting_id = this.AttachModel.meeting_id;
      attachData.upload_by = 2;
      this.dialogRef.close(0);
      this.showWarning("ไม่สามารถอัพโหลดเอกสารได้");
    }

  }

  onSelectFile(files: any, fileType: string): void {
    let fileList = (<HTMLInputElement>files.target).files;
    if (fileList && fileList.length > 0) {
      let file: File = fileList[0];
      this.frmGrpAttachUpload.controls["txtUploadFile"].setValue(file);
      this.fileAttr = file.name;
      this.currentFile = file;
    }
  }

  onNoClick(): void {
    console.log("closeDialog");
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