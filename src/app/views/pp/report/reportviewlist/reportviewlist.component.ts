import { Component, OnInit, inject, ElementRef, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { FileSaverService } from 'ngx-filesaver';
import { DatePipe } from '@angular/common';

import { ReportInsertdialogComponent } from '../report-insertdialog/report-insertdialog.component';
import { ReportDeletedialogComponent } from '../report-deletedialog/report-deletedialog.component';
import { ReportDownloaddialogComponent } from '../report-downloaddialog/report-downloaddialog.component';

import { SummaryreportService } from '@app/services/summaryreport.service';
import { Summaryreport } from '@app/models/summaryreport';
import { Summaryreportview } from '@app/models/summaryreportview';


@Component({
  selector: 'app-reportviewlist',
  templateUrl: './reportviewlist.component.html',
  styleUrls: ['./reportviewlist.component.css']
})
export class ReportviewlistComponent implements OnInit, OnDestroy {

  constructor(
    public SummaryreportService: SummaryreportService,
    public dialogService: MatDialog, 
    private router: Router,
    private cd: ChangeDetectorRef,
    private _FileSaverService: FileSaverService,
    public datepipe: DatePipe,
  ) {}

  loading = false;

  dataSource = new MatTableDataSource<Summaryreportview>();
  displayedColumns: string[] = ['index', 'meeting_set', 'meeting_year', 'meeting_term', 'upload_date', 'upload_name', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 20, 30];
  index: number;
  id: number;
  date: Date;

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData() {
    this.loading = true;
        var Summaryreport_input = new Summaryreportview();
        const subscribe = (this.SummaryreportService.Getsummaryreportview_All(Summaryreport_input)).subscribe(data => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.loading = false;
        });
        this.subscriptions.push();
  }

  async openAddDialog(){
    const dialogRef = await this.dialogService.open(ReportInsertdialogComponent, {
      width: '640px',
      height: '87%',
      data: {},
      disableClose: true
    });

    await dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
          setTimeout(() => {
            this.loadData()}, 500); 
        } 
    });
  }

  downloadReport(i: number, data: Summaryreport) {
    var filename = "";
    this.SummaryreportService.Download_Summaryreport(data.summaryreport_id).subscribe((response: any) => {
      this.date = new Date();
      let latest_date = this.datepipe.transform(this.date, 'ddMMyyyy_HHmmss');
      filename = data.summaryreport_name + latest_date?.toString();
      this._FileSaverService.save(response, filename); 
    }),
      (error: any) => console.log('Error downloading the file'), //when you use stricter type checking
      () => console.info('File downloaded successfully');
  }

  async deleteItem(i: number, data: Summaryreport) {
    const dialogRef = await this.dialogService.open(ReportDeletedialogComponent, {
      data: data,
      disableClose: true
    });

    await dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        setTimeout(() => {
          this.loadData()}, 500); 
      } 
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
