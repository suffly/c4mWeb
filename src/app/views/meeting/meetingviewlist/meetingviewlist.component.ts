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

import { MeetingInsertdialogComponent } from '../meeting-insertdialog/meeting-insertdialog.component';
import { MeetingDeletedialogComponent } from '../meeting-deletedialog/meeting-deletedialog.component';
import { MeetingDownloaddialogComponent } from '../meeting-downloaddialog/meeting-downloaddialog.component';


@Component({
  selector: 'app-meetingviewlist',
  templateUrl: './meetingviewlist.component.html',
  styleUrls: ['./meetingviewlist.component.css']
})
export class MeetingviewlistComponent implements OnInit, OnDestroy {

  constructor(
    public MeetingviewService: MeetingviewService,
    public dialogService: MatDialog, 
    private router: Router,
    ) {}
  
  loading = false;

  Meetingrow : number;
  MeetingviewModel : Meetingview[];
  dataSource = new MatTableDataSource<Meetingview>();
  //displayedColumns: string[] = ['index', 'meetingtype_name', 'meeting_set', 'meeting_year', 'meeting_time', 'meetingterm_name', 'meeting_date', 'count_consulation', 'count_consulationtotal', 'actions'];
  displayedColumns: string[] = ['index', 'meeting_set', 'meeting_year', 'meeting_time', 'meetingterm_name', 'meeting_date', 'owner_name', 'count_consulation', 'count_consulationtotal', 'actions'];
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
    localStorage.removeItem("meetingview");
    this.loadData();

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async loadData(){ 
    this.loading = true;
    var Meetview = new Meetingview();
    const subscription = (this.MeetingviewService.Getmeetingview_All(Meetview)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.MeetingviewModel = data;
      this.loading = false;
    });
    this.subscriptions.push();
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async openAddDialog(){
    const dialogRef = await this.dialogService.open(MeetingInsertdialogComponent, {
      width: '640px',
      height: '100%',
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

  async editItem(i: number, data: Meetingview) {
    this.id = data.meeting_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(MeetingInsertdialogComponent, {
      width: '640px',
      height: '100%',
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

  async deleteItem(i: number, data: Meetingview) {
    const dialogRef = await this.dialogService.open(MeetingDeletedialogComponent, {
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

  addCounselor(i: number, data: Meetingview)
  {
    this.id = data.meeting_id;
    this.index = i;
    this.Meetingrow = data.meeting_id;
    localStorage.setItem('meetingview', JSON.stringify(this.Meetingrow));

    setTimeout(() => {
      this.router.navigate(['/counselor'])
    }, 500);
    //[routerLink]="['/counselor']" << for html
  }



  

}
