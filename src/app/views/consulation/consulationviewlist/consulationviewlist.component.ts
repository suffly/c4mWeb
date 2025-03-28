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

import { ConsulationInsertdialogComponent } from '../consulation-insertdialog/consulation-insertdialog.component';
import { ConsulationDeletedialogComponent } from '../consulation-deletedialog/consulation-deletedialog.component';

@Component({
  selector: 'app-consulationviewlist',
  templateUrl: './consulationviewlist.component.html',
  styleUrls: ['./consulationviewlist.component.css']
})
export class ConsulationviewlistComponent implements OnInit, OnDestroy {

  constructor(
    public ConsulationdetailviewService: ConsulationdetailviewService,
    public ConsulationviewService: ConsulationviewService,
    public MeetingviewService: MeetingviewService,
    public dialogService: MatDialog, 
    private router: Router,
    ) {}

  loading = false;
  
  Meetingrow : number;
  Counselorrow: number;
  Consulationrow: number;
  dataSource = new MatTableDataSource<Consulationdetailview>();
  // displayedColumns: string[] = ['index', 'consulationdetail_topic', 'consulationdetail_detail', 'ministry_name', 'province_name', 'objective_name', 'topictype_name', 'status_name', 'actions'];
  displayedColumns: string[] = ['index', 'consulationdetail_topic', 'consulationdetail_detail', 'objective_name', 'topictype_name', 'status_name', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 20, 30];
  index: number;
  id: number;

  headMeeting: string = "";
  MeetingDate: Date;
  headCounselor: string = "";

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ConsulationdetailviewModel: Consulationdetailview;
  ConsulationviewModel: Consulationview;
  MeetingModel: Meetingview;

  ngOnInit(): void{
    localStorage.removeItem("consulationview");
    this.loadData();

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async loadData() {
    this.loading = true;
    this.Meetingrow = JSON.parse(localStorage.getItem('meetingview')||'{}');
    this.Counselorrow = JSON.parse(localStorage.getItem('counselorview')||'{}');
    //console.log("LoadConsulation, MeetingID : "+this.Meetingrow+" CounselorID : "+this.Counselorrow);
    
    var Meetingview_input = new Meetingview();
    Meetingview_input.meeting_id = this.Meetingrow;
    this.MeetingviewService.Getmeetingview_byID(Meetingview_input).subscribe(data => {
      this.MeetingModel = data
      this.headMeeting =  "    การ" + data.meetingtype_name + 
                          "    ชุดที่ " + data.meetingset_desc + 
                          "    ปีที่ " + data.meeting_year + 
                          "    ครั้งที่ " + data.meeting_time + 
                          "    ( " + data.meetingterm_name +" )";
      this.MeetingDate = data.meeting_date;
    });

    var Consulationview_input = new Consulationview();
    Consulationview_input.consulation_id = this.Counselorrow;
    this.ConsulationviewService.Getconsulationview_byID(Consulationview_input).subscribe(data => {
      this.ConsulationviewModel = data
      this.headCounselor = "    ผู้หารือ " + data.counselor_title + data.counselor_name +
                           " " + data.counselor_middlename +
                           " " + data.counselor_surname +
                           "    สมาชิกสภาผู้แทนราษฎร" + data.counselortype_name + 
                           " " + data.partylist_name;
    });

    var Consulationdetailview_input = new Consulationdetailview();
    Consulationdetailview_input.consulation_id = this.Counselorrow;
    const subscribe = (this.ConsulationdetailviewService.GetConsulationdetail_byConsulation(Consulationdetailview_input)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.ConsulationdetailviewModel = data;
      this.loading = false;
    });

    this.subscriptions.push();
  }

  async openAddDialog(){
    const dialogRef = await this.dialogService.open(ConsulationInsertdialogComponent, {
      width: '1280px',
      height: '85%',
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

  async editItem(i: number, data: Consulationdetailview) {
    this.id = data.consulationdetail_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(ConsulationInsertdialogComponent, {
      width: '1280px',
      height: '85%',
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

  async deleteItem(i: number, data: Consulationdetailview) {
    const dialogRef = await this.dialogService.open(ConsulationDeletedialogComponent, {
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
  
  addDetail(i:number, data: Consulationdetailview)
  {
    this.id = data.consulationdetail_id;
    this.index = i;
    this.Consulationrow = data.consulationdetail_id;
    localStorage.setItem('consulationview', JSON.stringify(this.Consulationrow));

    setTimeout(() => {
      this.router.navigate(['/consulationdetail'])
    }, 500);
    //[routerLink]="['/response']" << for html
  }

  backClicked() {
    setTimeout(() => {
      this.router.navigate(['/counselor'])
    }, 500);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
