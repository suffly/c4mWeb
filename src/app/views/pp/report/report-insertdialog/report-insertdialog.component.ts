import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { HttpEventType, HttpResponse ,HttpEvent} from '@angular/common/http';

import { ReportviewlistComponent } from '../reportviewlist/reportviewlist.component';

import { SummaryreportService } from '@app/services/summaryreport.service';
import { Summaryreportview } from '@app/models/summaryreportview';
import { Summaryreport } from '@app/models/summaryreport';
import { Summaryreportfiles } from '@app/models/summaryreportfiles';
import { Userprofile } from '@app/models/userprofile';

import { MeetingsetService } from '@app/services/meetingset.service';
import { Meetingset } from '@app/models/meetingset';
import { MeetingtermService } from '@app/services/meetingterm.service';
import { Meetingterm } from '@app/models/meetingterm';

interface DDLMeetingYear {
  value : number;
  viewvalue : number;
}

@Component({
  selector: 'app-report-insertdialog',
  templateUrl: './report-insertdialog.component.html',
  styleUrls: ['./report-insertdialog.component.css']
})
export class ReportInsertdialogComponent implements OnInit  {

  constructor(
    public dialogRef: MatDialogRef<ReportviewlistComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
    public SummaryreportService: SummaryreportService,
    public MeetingsetService: MeetingsetService,
    public MeetingtermService: MeetingtermService,

    @Inject(MAT_DIALOG_DATA) public SummaryreportviewModel: Summaryreportview,
    ) {
    dialogRef.disableClose = true;
  }
    
  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  DDLMeetingYear : DDLMeetingYear[] = [
    {value: 1, viewvalue: 1},
    {value: 2, viewvalue: 2},
    {value: 3, viewvalue: 3},
    {value: 4, viewvalue: 4},  
  ]

  MeetingtermModel : Meetingterm[];
  MeetingsetModel : Meetingset[];

  selectedFiles?: FileList;
  currentFile: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  fileAttr = 'เลือกไฟล์';

  frmGrpSummaryReportUpload: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    this.loadData();
    this.frmGrpSummaryReportUpload = this.formBuilder.group({
      ddlset: new FormControl({value: '', disabled: false}, [Validators.required]),
      ddlyear: new FormControl({value: '', disabled: false}, [Validators.required]),
      ddlterm: new FormControl({value: '', disabled: false}, [Validators.required]),
      summaryreport_name: new FormControl({ value: '', disabled: false }, [Validators.required,Validators.maxLength(1000)]),
      txtUploadFile: new FormControl({ value: '', disabled: false }, [Validators.required]),
      txtInputUploadFile: new FormControl({ value: '', disabled: false }, [Validators.required])
    });
  }

  loadData(){
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    var Meetset = new Meetingset();
    this.MeetingsetService.GetMeetingSet(Meetset).subscribe(data => {this.MeetingsetModel = data
    });
    var Meetterm = new Meetingterm();
    this.MeetingtermService.DDLmeetingterm(Meetterm).subscribe(data => {this.MeetingtermModel = data 
    });
  }

  onSelectFile(files: any, fileType: string): void {
    let fileList = (<HTMLInputElement>files.target).files;
    if (fileList && fileList.length > 0) {
      let file: File = fileList[0];
      this.frmGrpSummaryReportUpload.controls["txtUploadFile"].setValue(file);
      this.fileAttr = file.name;
      this.currentFile = file;
    }
  }

  async onSubmit(){
    if(this.frmGrpSummaryReportUpload.invalid){return;}
    this.progress = 0;
    var reportData = new Summaryreportfiles();
    reportData.summaryreport_name = this.frmGrpSummaryReportUpload.controls["summaryreport_name"].value;
    reportData.meetingset_id = this.frmGrpSummaryReportUpload.controls.ddlset.value;
    reportData.meeting_year = this.frmGrpSummaryReportUpload.controls.ddlyear.value;
    reportData.meetingterm_id = this.frmGrpSummaryReportUpload.controls.ddlterm.value;
    reportData.files = this.currentFile;

    if(this.SummaryreportviewModel.summaryreport_id == undefined)
    {
      reportData.upload_by = this.currentUser.user_id;
      (await this.SummaryreportService.Upload_Summaryreport(reportData)).subscribe({
        next: (event:any) => {
          if(event.type === HttpEventType.UploadProgress){
            this.progress = Math.round(100*event.loaded/event.total);
          }
          else if (event instanceof HttpResponse){
            this.message = event.body.message;
            if(this.message == 'Success' ) {
              this.showSuccess('บันทึกเอกสารเรียบร้อย');
              this.dialogRef.close(1);
            }
            else {
              this.showWarning('ไม่สามารถบันทึกเอกสารได้');
              this.dialogRef.close(0);
            }
          }
        },
        error: (err: any) => {
          if (err.error && err.error.message) {
            this.message = err.error.message;
          }
          else {
            this.message = 'Could not upload the file!';
          }
          this.showWarning('ไม่สามารถบันทึกเอกสารได้ : ' + this.message);
          this.dialogRef.close(0);
        }
      });
    }
    else
    {
      this.dialogRef.close(0);
      this.showWarning("ไม่สามารถอัพโหลดเอกสารได้");
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