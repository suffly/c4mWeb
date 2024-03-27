import { Component, OnInit, inject, ElementRef, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { MeetingviewService } from '@app/services/meetingview.service';
import { Meetingview } from 'src/app/models/meetingview';
import { ConsulationviewService } from '@app/services/consulationview.service';
import { Consulationview } from '@app/models/consulationview';
import { ConsulationdetailviewService } from '@app/services/consulationdetailview.service';
import { Consulationdetailview } from '@app/models/consulationdetailview';
import { ConsulationministryService } from '@app/services/consulationministry.service';
import { Consulationministry } from '@app/models/consulationministry';
import { ResponseService } from '@app/services/response.service';
import { Response } from '@app/models/response';

import { ResponseInsertdialogComponent } from '../response-insertdialog/response-insertdialog.component';
import { ResponseDeletedialogComponent } from '../response-deletedialog/response-deletedialog.component';



@Component({
  selector: 'app-responselist',
  templateUrl: './responselist.component.html',
  styleUrls: ['./responselist.component.css']
})
export class ResponselistComponent implements OnInit, OnDestroy {

  constructor(
    public ConsulationministryService: ConsulationministryService,
    public ConsulationdetailviewService: ConsulationdetailviewService,
    public ConsulationviewService: ConsulationviewService,
    public MeetingviewService: MeetingviewService,
    public ResponseService: ResponseService,
    public dialogService: MatDialog, 
    private router: Router,
    private cd: ChangeDetectorRef,
    ) {}

  Meetingrow: number;
  Counselorrow: number;
  Consulationrow: number;
  Consulationministryrow: number;
  Responserow: number;
  ResponseModel: Response;
  dataSource = new MatTableDataSource<Response>();
  displayedColumns: string[] = ['index', 'response_topic', 'create_date', 'create_title', 'create_name', 'create_surname', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 20, 30];
  index: number;
  id: number;

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ngOnInit(): void {
    localStorage.removeItem("response");
    this.loadData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData() {
    this.Meetingrow = JSON.parse(localStorage.getItem('meetingview')||'{}');
    this.Counselorrow = JSON.parse(localStorage.getItem('counselorview')||'{}');
    this.Consulationrow = JSON.parse(localStorage.getItem('consulationview')||'{}');
    this.Consulationministryrow = JSON.parse(localStorage.getItem('consulationminitryview')||'{}');
    this.checkStatusConsulationDetail();
    //console.log("LoadResponse, MeetingID : "+this.Meetingrow+" CounselorID : "+this.Counselorrow+" ConsulationID : "+this.Consulationrow+" CSLMID : "+this.Consulationministryrow);
    var Responseview_input = new Response();
    Responseview_input.meeting_id = this.Meetingrow;
    Responseview_input.consulation_id = this.Counselorrow;
    Responseview_input.consulationdetail_id = this.Consulationrow;
    Responseview_input.consulationministry_id = this.Consulationministryrow;
    const subscribe = (this.ResponseService.GetResponse_byConsulationministry(Responseview_input)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.ResponseModel = data;
    });
    this.subscriptions.push();
  }

  async openAddDialog(){
    const dialogRef = await this.dialogService.open(ResponseInsertdialogComponent, {
      width: '1280px',
      height: '640px',
      data: {},
      disableClose: true
    });

    await dialogRef.afterClosed().subscribe(result => {
       if (result == 1) {
          setTimeout(() => {
            this.checkStatusConsulationDetail()
            this.loadData()}, 500); 
        } 
    });
  }

  async editItem(i: number, data: Response) {
    this.id = data.response_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(ResponseInsertdialogComponent, {
      width: '1280px',
      height: '640px',
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

  async deleteItem(i: number, data: Response) {
    const dialogRef = await this.dialogService.open(ResponseDeletedialogComponent, {
      data: data,
      disableClose: true
    });

    await dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        setTimeout(() => {
          this.checkStatusConsulationDetail()
          this.loadData()}, 500); 
      } 
    });
  }

  addDetail(i:number, data: Response) {
    this.id = data.response_id;
    this.index = i;
    this.Responserow = data.response_id;
    localStorage.setItem('response', JSON.stringify(this.Responserow));

    setTimeout(() => {
      this.router.navigate(['/responsedetail'])
    }, 500);
    //[routerLink]="['/response']" << for html
  }

  backClicked() {
    setTimeout(() => {
      this.router.navigate(['/consulationdetail'])
    }, 500);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  checkStatusConsulationDetail() {
    var param_obj =new Consulationministry();
    param_obj.consulationdetail_id = this.Consulationrow;
    const subscription = this.ConsulationministryService.checkStatusConsulationDetail(param_obj).subscribe((data) => {
      this.cd.detectChanges();
    });
    this.subscriptions.push();
  }


}
