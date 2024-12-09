import { Component, inject, ElementRef, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { MeetingviewService } from 'src/app/services/meetingview.service';
import { Meetingview } from 'src/app/models/meetingview';
import { Userprofile } from '@app/models/userprofile';

import { MeetingDownloaddialogComponent } from '@app/views/meeting/meeting-downloaddialog/meeting-downloaddialog.component';

import { ApprovedApprovedialogComponent } from '../approved-approvedialog/approved-approvedialog.component';
import { ApprovedEditdialogComponent } from '../approved-editdialog/approved-editdialog.component';
import { ApprovedPublicdialogComponent } from '../approved-publicdialog/approved-publicdialog.component';


@Component({
  selector: 'app-approvedviewlist',
  templateUrl: './approvedviewlist.component.html',
  styleUrls: ['./approvedviewlist.component.css']
})
export class ApprovedviewlistComponent implements OnInit, OnDestroy {

  constructor(
    public MeetingviewService: MeetingviewService,
    public dialogService: MatDialog, 
    private router: Router,
    ) {}

    btn_public:boolean = false;
    btn_approve:boolean = false;
    btn_owner:boolean = false;
    currentUser: Userprofile;
    private readonly CURRENT_USER = 'currentUser';
    Meetingrow : number;
    MeetingviewModel : Meetingview[];
    dataSource = new MatTableDataSource<Meetingview>();
    displayedColumns: string[] = ['index', 'meetingtype_name', 'meeting_set', 'meeting_year', 'meeting_time', 'meetingterm_name', 'meeting_date', 'progressstatus_name', 'actions'];
    pageSize: number = 10;
    pageSizeOptions = [10, 25, 50];
    index: number;
    id: number;
    
    subscriptions = [];
    private ngUnsubscribe = new Subject<void>();
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;

    ngOnInit(): void{
      //localStorage.removeItem("meetingview");
      this.btn_public = false; //Publish to pubic || change status by manager 
      this.btn_approve = false; //Approve process phase 3 (On Developing process) hide button and screen
      this.btn_owner = false; //Assign officer to owner meeting  
      this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
      if (this.currentUser.role_id == 9)
      {
        this.btn_public = true;
        this.btn_owner = true;
        //this.btn_approve = true;
      }
      else if(this.currentUser.role_id == 8 )
      {
        //this.btn_approve = true;
      }
      else if(this.currentUser.role_id == 7)
      {
        this.btn_owner = true;
        //this.btn_approve = true;
      }
      else if(this.currentUser.role_id == 6)
      {
        this.btn_public = true;
        //this.btn_approve = true;
      }

      this.loadData();
      
    }
  
    ngOnDestroy() {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }

    async loadData(){ 
      var Meetview = new Meetingview();
      const subscription = (this.MeetingviewService.Getmeetingview_All(Meetview)).subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.MeetingviewModel = data;
  
        //console.log(this.MeetingviewModel);
      });
      this.subscriptions.push();
    }

    public(i: number, data: Meetingview){
      this.id = data.meeting_id;
      this.index = i;

      const dialogRef = this.dialogService.open(ApprovedPublicdialogComponent,
        {
          width: '800px',
          height: '400px',
          data: data,
          disableClose: true
        }
      );
  
      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          setTimeout(() => {
            this.loadData()}, 500); 
        } 
      });
    }
  
    editOwner(i: number, data: Meetingview){
      this.id = data.meeting_id;
      this.index = i;

      const dialogRef = this.dialogService.open(ApprovedEditdialogComponent,
        {
          width: '800px',
          height: '400px',
          data: data,
          disableClose: true
        }
      );
  
      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          setTimeout(() => {
            this.loadData()}, 500); 
        } 
      });
    }

    Approved(i: number, data: Meetingview){
      this.id = data.meeting_id;
      this.index = i;

      const dialogRef = this.dialogService.open(ApprovedApprovedialogComponent,
        {
          width: '800px',
          height: '600px',
          data: data,
          disableClose: true
        }
      );
  
      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          setTimeout(() => {
            this.loadData()}, 500); 
        } 
      });
    }

    OpenscreenExport(i: number, data: Meetingview) {
      this.id = data.meeting_id;
      this.index = i;
  
      const dialogRef = this.dialogService.open(MeetingDownloaddialogComponent,
        {
          width: '800px',
          height: '600px',
          data: data,
          disableClose: true
        }
      );
  
      dialogRef.afterClosed().subscribe(result => {
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
