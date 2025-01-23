import { Component, inject, ElementRef, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { PartylistviewService } from '@app/services/partylistview.service';
import { Partylistview } from '@app/models/partylistview';

import { PartylistInsertdialogComponent } from '../partylist-insertdialog/partylist-insertdialog.component';

@Component({
  selector: 'app-partylistviewlist',
  templateUrl: './partylistviewlist.component.html',
  styleUrls: ['./partylistviewlist.component.css']
})
export class PartylistviewlistComponent implements OnInit, OnDestroy{

  constructor(
      private router: Router,
      public dialogService: MatDialog, 
      public PartylistviewService: PartylistviewService,
  
    ) {}

    loading = false;

    dataSource = new MatTableDataSource<Partylistview>();
    displayedColumns: string[] = ['index', 'partylist_name', 'counselordivision_name', 'actions'];
    pageSize: number = 10;
    pageSizeOptions = [10, 20, 30, 40, 50];
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
    this.loading = true;
    var partylistview = new Partylistview();
    const subscription = (this.PartylistviewService.Getpartylistview(partylistview)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    });
    this.subscriptions.push();
  }

  async openAddDialog(){
    const dialogRef = await this.dialogService.open(PartylistInsertdialogComponent, {
      width: '640px',
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

  async editItem(i: number, data: Partylistview){
    this.id = data.partylist_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(PartylistInsertdialogComponent, {
      width: '640px',
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
