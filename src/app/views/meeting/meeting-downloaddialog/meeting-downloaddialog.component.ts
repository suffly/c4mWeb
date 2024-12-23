import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { FileSaverService } from 'ngx-filesaver';
import { DatePipe } from '@angular/common';

import { Template } from '@app/models/template';
import { Meetingview } from '@app/models/meetingview';
import { TemplateService } from '@app/services/template.service';
import { MeetingviewlistComponent } from '../meetingviewlist/meetingviewlist.component';
import { ReportmeetingService } from '@app/services/reportmeeting.service';

@Component({
  selector: 'app-meeting-downloaddialog',
  templateUrl: './meeting-downloaddialog.component.html',
  styleUrls: ['./meeting-downloaddialog.component.css']
})
export class MeetingDownloaddialogComponent implements OnInit {

  dataSource = new MatTableDataSource<Template>();
  displayedColumns: string[] = ['index', 'template_topic', 'actions'];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  templateModel: Template[];
  loading: boolean = true;
  date:Date;

  constructor(
    public dialogRef: MatDialogRef<MeetingviewlistComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,
    public datepipe:DatePipe,
    private FileSaverService: FileSaverService,
    private TemplateService: TemplateService,
    private ReportmeetingService: ReportmeetingService,

    @Inject(MAT_DIALOG_DATA) public MeetingViewModel: Meetingview,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.loaddata();
  }

  loaddata()
  {
    this.loading = true;
    var template_input = new Template()
    template_input.templatetype_id = 1;
    this.TemplateService.DDLtemplate(template_input).subscribe(data => {
      this.templateModel = data;
      this.dataSource.data = data;
      this.loading = false;
    });
  }

  download(i:number,data:Template) {
    if (this.MeetingViewModel.count_consulationtotal == 0)
    {
      this.showWarning('ไม่สามารถดาวน์โหลดข้อมูลได้');
    }
    else
    {
      if (data.template_index == 1)
        {
          var filename = "";
          this.ReportmeetingService.Createmeetingsummaryreport(this.MeetingViewModel.meeting_id).subscribe((response: Blob) => {
            this.date = new Date();
            let latest_date = this.datepipe.transform(this.date, 'ddMMyyyy_HHmmss');
            filename = data.template_topic + latest_date?.toString() + ".xlsx";
            this.FileSaverService.save(response, filename);
            this.showSuccess('ดาวน์โหลดข้อมูลสำเร็จ');
          }),
            (error: any) => console.log('Error downloading the file'), //when you use stricter type checking
            () => console.info('File downloaded successfully');
        }

        if (data.template_index == 2)
          {
            var filename = "";
            this.ReportmeetingService.Createmeetingstatisticreport(this.MeetingViewModel.meeting_id).subscribe((response: Blob) => {
              this.date = new Date();
              let latest_date = this.datepipe.transform(this.date, 'ddMMyyyy_HHmmss');
              filename = data.template_topic + latest_date?.toString() + ".xlsx";
              this.FileSaverService.save(response, filename);
              this.showSuccess('ดาวน์โหลดข้อมูลสำเร็จ');
            }),
              (error: any) => console.log('Error downloading the file'), //when you use stricter type checking
              () => console.info('File downloaded successfully');
          }
    
        if (data.template_index == 3)
        {
          var filename = "";
          this.ReportmeetingService.Createmeetingresultreport(this.MeetingViewModel.meeting_id).subscribe((response: Blob) => {
            this.date = new Date();
            let latest_date = this.datepipe.transform(this.date, 'ddMMyyyy_HHmmss');
            filename = data.template_topic + latest_date?.toString() + ".xlsx";
            this.FileSaverService.save(response, filename);
            this.showSuccess('ดาวน์โหลดข้อมูลสำเร็จ');
          }),
            (error: any) => console.log('Error downloading the file'), //when you use stricter type checking
            () => console.info('File downloaded successfully');
        }

    }
  }


  onNoClick(): void {
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