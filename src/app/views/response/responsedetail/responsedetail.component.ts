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

import { ResponseInsertdialogComponent } from '../response-insertdialog/response-insertdialog.component';
import { AttachresInsertdialogComponent } from '../attachres/attachres-insertdialog/attachres-insertdialog.component';
import { AttachresDeletedialogComponent } from '../attachres/attachres-deletedialog/attachres-deletedialog.component';

import { MeetingviewService } from '@app/services/meetingview.service';
import { Meetingview } from 'src/app/models/meetingview';
import { ConsulationviewService } from '@app/services/consulationview.service';
import { Consulationview } from '@app/models/consulationview';
import { ConsulationdetailviewService } from '@app/services/consulationdetailview.service';
import { Consulationdetailview } from '@app/models/consulationdetailview';
import { ResponseService } from '@app/services/response.service';
import { Response } from '@app/models/response';
import { AttachresService } from '@app/services/attachres.service';
import { Attachres } from '@app/models/attachres';

@Component({
  selector: 'app-responsedetail',
  templateUrl: './responsedetail.component.html',
  styleUrls: ['./responsedetail.component.css']
})
export class ResponsedetailComponent implements OnInit, OnDestroy {
  
  constructor(
    public AttachresService: AttachresService,
    public ResponseService: ResponseService,
    public ConsulationdetailviewService: ConsulationdetailviewService,
    public ConsulationviewService: ConsulationviewService,
    public MeetingviewService: MeetingviewService,
    public dialogService: MatDialog, 
    private router: Router,
    private _FileSaverService: FileSaverService,
    public datepipe: DatePipe,
  ) {}

  loading = false;

  Meetingrow : number;
  Counselorrow: number;
  Consulationrow: number;
  Consulationministryrow: number;
  Responserow: number;

  dataSourceResponse = new MatTableDataSource<Response>();
  displayedColumnsResponse: string[] = ['meeting_id', 'response_topic', 'create_date', 'create_title', 'create_name', 'create_surname', 'actions'];
  @ViewChild('MatPaginatorResponse') paginatorResponse: MatPaginator;
  @ViewChild('MatSortResponse', { static: true }) sortResponse: MatSort;
  @ViewChild('filterResponse', { static: true }) filterResponse: ElementRef;
  pageSizeResponse: number = 10;
  pageSizeOptionsResponse = [10, 20, 30];
  indexResponse: number;
  // idResponse: number;

  dataSourceAttachres = new MatTableDataSource<Attachres>();
  displayedColumnsAttachres: string[] = ['meeting_id', 'attachres_name', 'actions'];
  @ViewChild('MatPaginatorAttachres') paginatorAttachres: MatPaginator;
  @ViewChild('MatSortAttachres', { static: true }) sortAttachres: MatSort;
  @ViewChild('filterAttachres', { static: true }) filterAttachres: ElementRef;
  pageSizeAttachres: number = 10;
  pageSizeOptionsAttachres = [10, 20, 30];
  indexAttachres: number;
  // idAttachres: number;

  index: number;
  id: number;
  date: Date;

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  ResponseModel: Response;
  ConsulationdetailviewModel: Consulationdetailview;
  ConsulationviewModel: Consulationview;
  MeetingModel: Meetingview;
  AttachresModel: Attachres;
  
  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData(){
      this.Meetingrow = JSON.parse(localStorage.getItem('meetingview')||'{}');
      this.Counselorrow = JSON.parse(localStorage.getItem('counselorview')||'{}');
      this.Consulationrow = JSON.parse(localStorage.getItem('consulationview')||'{}');
      this.Consulationministryrow = JSON.parse(localStorage.getItem('consulationminitryview')||'{}')
      this.Responserow = JSON.parse(localStorage.getItem('response')||'{}');
      this.loadResponse();
      this.loadAttachres();
  }

  loadResponse() {
    this.loading = true;
    var Response_input = new Response();
    Response_input.response_id = this.Responserow;
    const subscribe = (this.ResponseService.GetResponse_byid(Response_input)).subscribe(data => {
      this.dataSourceResponse.data = data;
      this.dataSourceResponse.paginator = this.paginatorResponse;
      this.ResponseModel = data;
      this.loading = false;
    });
    this.subscriptions.push();
  }

  loadAttachres() {
    this.loading = true;
    var Attachres_input = new Attachres();
    Attachres_input.response_id = this.Responserow;
    const subscribe = (this.AttachresService.GetAttachres_byResponse(Attachres_input)).subscribe(data => {
      this.dataSourceAttachres.data = data;
      this.dataSourceAttachres.paginator = this.paginatorAttachres;
      this.AttachresModel = data;
      this.loading = true;
    })
    this.subscriptions.push();
  }

  async editResponseItem(i: number, data: Response) {
    this.id = data.response_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(ResponseInsertdialogComponent, {
      width: '640px',
      height: '640px',
      data: data,
      disableClose: true
    });

    await dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        setTimeout(() => {
          this.loadResponse()}, 500); 
      } 
    });
  }

  async openAddAttachresDialog() {
    const dialogRef = await this.dialogService.open(AttachresInsertdialogComponent, {
      width: '640px',
      height: 'auto',
      data: {},
    });

    dialogRef.afterClosed().toPromise().then(result => {
      if(result == 1) {
        setTimeout(() => {
          this.loadAttachres()}, 500);
      }
    });
  }

  async editAttachresItem(i: number, data: Attachres) {
    this.id = data.attachres_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(AttachresInsertdialogComponent, {
      width: '640px',
      height: 'auto',
      data: data,
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result == 1) {
        setTimeout(() => {
          this.loadAttachres()}, 500);
      }

    });
  }

  async deleteAttachresItem(i: number, data: Attachres) {
    const dialogRef  = await this.dialogService.open(AttachresDeletedialogComponent, {
      data: data,
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result == 1){
        setTimeout(() => {
          this.loadAttachres()}, 500);
      }
    })
  }

  downloadAttachres(i: number, data: Attachres) {
    var filename = "";
    this.AttachresService.Download_Attachres(data.attachres_id).subscribe((response: any) => {
      this.date = new Date();
      let latest_date = this.datepipe.transform(this.date, 'ddMMyyyy_HHmmss');
      filename = data.attachres_name + latest_date?.toString();
      this._FileSaverService.save(response, filename); 
    }),
      (error: any) => console.log('Error downloading the file'), //when you use stricter type checking
      () => console.info('File downloaded successfully');
  }


  backClicked() {
    setTimeout(() => {
      this.router.navigate(['/response'])
    }, 500);
  }


}
