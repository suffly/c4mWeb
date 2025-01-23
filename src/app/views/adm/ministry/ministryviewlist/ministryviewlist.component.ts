import { Component, inject, ElementRef, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { MinistryService } from '@app/services/ministry.service';
import { Ministry } from '@app/models/ministry';

import { MinistryInsertdialogComponent } from '../ministry-insertdialog/ministry-insertdialog.component';

@Component({
  selector: 'app-ministryviewlist',
  templateUrl: './ministryviewlist.component.html',
  styleUrls: ['./ministryviewlist.component.css']
})
export class MinistryviewlistComponent implements OnInit, OnDestroy {

  constructor(
      private router: Router,
      public dialogService: MatDialog,
      public MinistryService: MinistryService,
  
    ){}
  
  loading = false;
  
  dataSource = new MatTableDataSource<Ministry>();
  displayedColumns: string[] = ['index', 'ministry_name', 'ministry_head', 'ministry_invitation', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 20, 30, 40, 50];
  index:number;
  id:number;

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData() {
    this.loading = true;
    var ministry = new Ministry();
    const subscription = (this.MinistryService.Getministry_all(ministry)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    });
    this.subscriptions.push();
  }

  async openAddDialog(){
    const dialogRef = await this.dialogService.open(MinistryInsertdialogComponent, {
      width: '720px',
      height: '65%',
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

  async editItem(i: number, data: Ministry){
    this.id = data.ministry_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(MinistryInsertdialogComponent, {
      width: '720px',
      height: '65%',
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
