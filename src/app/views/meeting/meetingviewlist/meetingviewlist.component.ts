import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { MeetingviewService } from 'src/app/services/meetingview.service';
import { Meetingview } from 'src/app/models/meetingview';
import { MeetingInsertdialogComponent } from '../meeting-insertdialog/meeting-insertdialog.component';
import { MeetingDeletedialogComponent } from '../meeting-deletedialog/meeting-deletedialog.component';

import { SigninService } from 'src/app/services/signin.service';
import { Signin } from 'src/app/models/signin';

@Component({
  selector: 'app-meetingviewlist',
  templateUrl: './meetingviewlist.component.html',
  styleUrls: ['./meetingviewlist.component.css']
})
export class MeetingviewlistComponent {

  constructor(
    public MeetingviewService: MeetingviewService,
    public dialogService: MatDialog, 
    private Router: Router,

    public SigninService: SigninService,

    ) {}

  MeetingviewModel : Meetingview[];
  dataSource = new MatTableDataSource<Meetingview>();
  displayedColumns: string[] = ['index', 'meetingtype_name', 'meeting_set', 'meeting_year', 'meeting_time', 'meetingterm_name', 'meeting_date', 'create_name', 'create_date', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 25, 50];
  index: number;
  id: number;
  
  SigninData: Signin;

  //subscriptions = [];
  //private ngUnsubscribe = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ngOnInit(): void{
    this.loadData();
    // let passwrod: string = "714529";
    // let encoded: string = btoa(passwrod);
    // console.log("Password encoded (",passwrod,"): ", encoded);
    this.SigninService.parliamentSignIn().subscribe(data => {
      this.SigninData = data;
      console.log(this.SigninData);
    });
  }

  async loadData(){ 
    console.log("LoadData");   
    var Meetview = new Meetingview();
    this.MeetingviewService.Getmeetingview_All(Meetview).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.MeetingviewModel = data;
      console.log(this.MeetingviewModel);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async openAddDialog(){
    console.log("openAddDialog");
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





  

}
