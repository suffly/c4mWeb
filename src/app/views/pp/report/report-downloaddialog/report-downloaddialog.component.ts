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

import { SummaryreportService } from '@app/services/summaryreport.service';
import { Summaryreport } from '@app/models/summaryreport';
import { PpsearchComponent } from '../../ppsearch/ppsearch.component';

@Component({
  selector: 'app-report-downloaddialog',
  templateUrl: './report-downloaddialog.component.html',
  styleUrls: ['./report-downloaddialog.component.css']
})
export class ReportDownloaddialogComponent implements OnInit  {

  constructor(
    public dialogRef: MatDialogRef<PpsearchComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,
    public datepipe:DatePipe,
    private FileSaverService: FileSaverService,
    private SummaryreportService: SummaryreportService,

    @Inject(MAT_DIALOG_DATA) public MeetingViewModel: Summaryreport,
  ) {
    dialogRef.disableClose = true;
  }

  dataSource = new MatTableDataSource<Summaryreport>();
  displayedColumns: string[] = ['index', 'summaryreport_name', 'actions'];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  SummaryreportModel: Summaryreport[];
  loading: boolean = true;
  date:Date;
  
  ngOnInit(): void {
    this.loaddata();
  }

  loaddata()
  {
    this.loading = true;
    var Summaryreport_input = new Summaryreport()
    this.SummaryreportService.Getsummaryreport_All(Summaryreport_input).subscribe(data => {
      this.SummaryreportModel = data;
      this.dataSource.data = data;
      this.loading = false;
    });
  }

  download(i:number, data:Summaryreport){
    this.loading = true;
    var filename = "";
    this.SummaryreportService.Download_Summaryreport(data.summaryreport_id).subscribe((response: Blob) => {
      this.date = new Date();
      let latest_date = this.datepipe.transform(this.date, 'ddMMyyyy_HHmmss');
      filename = data.summaryreport_name + latest_date?.toString();
      this.FileSaverService.save(response, filename);
      this.showSuccess('ดาวน์โหลดข้อมูลสำเร็จ');
      this.loading = false;
    }),
      (error: any) => console.log('Error downloading the file'), //when you use stricter type checking
      () => console.info('File downloaded successfully');
      this.loading = false;
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
