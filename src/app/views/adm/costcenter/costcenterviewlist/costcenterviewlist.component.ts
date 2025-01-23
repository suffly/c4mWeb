import { Component, inject, ElementRef, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { CostcenterService } from '@app/services/costcenter.service';
import { Costcenter } from '@app/models/costcenter';

import { CostcenterInsertdialogComponent } from '../costcenter-insertdialog/costcenter-insertdialog.component';

@Component({
  selector: 'app-costcenterviewlist',
  templateUrl: './costcenterviewlist.component.html',
  styleUrls: ['./costcenterviewlist.component.css']
})
export class CostcenterviewlistComponent implements OnInit, OnDestroy {
  
  constructor(
    private router: Router,
    public dialogService: MatDialog,
    public CostcenterService: CostcenterService,

  ){}

  loading = false;
  
  dataSource = new MatTableDataSource<Costcenter>();
  displayedColumns: string[] = ['index', 'costcenter_name', 'costcenter_shortname', 'actions'];
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
    var costcenter = new Costcenter();
    const subscription = (this.CostcenterService.Getcostcenter_all(costcenter)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    });
    this.subscriptions.push();
  }

  async openAddDialog(){
    const dialogRef = await this.dialogService.open(CostcenterInsertdialogComponent, {
      width: '720px',
      height: '50%',
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

  async editItem(i: number, data: Costcenter){
    this.id = data.costcenter_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(CostcenterInsertdialogComponent, {
      width: '720px',
      height: '50%',
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
