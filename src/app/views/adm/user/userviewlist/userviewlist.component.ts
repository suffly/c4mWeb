import { Component, inject, ElementRef, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { UserprofileviewService } from '@app/services/userprofileview.service';
import { Userprofileview } from '@app/models/userprofileview';

import { UserInsertdialogComponent } from '../user-insertdialog/user-insertdialog.component';
import { result } from 'lodash';


@Component({
  selector: 'app-userviewlist',
  templateUrl: './userviewlist.component.html',
  styleUrls: ['./userviewlist.component.css']
})
export class UserviewlistComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    public dialogService: MatDialog, 
    public UserprofileviewService: UserprofileviewService,

  ) {}

  dataSource = new MatTableDataSource<Userprofileview>();
  displayedColumns: string[] = ['index', 'user_login', 'user_title', 'user_name', 'user_midname', 'user_surname', 'costcenter_name', 'userlevel_name', 'usertype_name', 'actions'];
  pageSize: number = 50;
  pageSizeOptions = [50, 100, 200, 300, 400, 500];
  index:number;
  id:number;

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;


  ngOnInit(): void{
    this.loadData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData(){

  }

  async openAddDialog(){
    const dialogRef = await this.dialogService.open(UserInsertdialogComponent, {
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

  async editItem(i: number, data: Userprofileview){
    this.id = data.user_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(UserInsertdialogComponent, {
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

  backClicked(){

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
