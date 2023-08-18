import { Component, OnInit, inject, ElementRef, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { Meetingview } from 'src/app/models/meetingview';
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
    public dialogService: MatDialog, 
    private Router: Router,
    ) {}

  Meetingrow : Meetingview;
  Counselorrow: Consulationview;
  Consulationrow: Consulationdetailview;
  dataSource = new MatTableDataSource<Consulationdetailview>();
  displayedColumns: string[] = ['index', 'consulationdetail_topic', 'consulationdetail_detail', 'ministry_name', 'province_name', 'objective_name', 'topictype_name', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 20, 30];
  index: number;
  id: number;

  subscriptions = [];
  private ngUnsubscribe = new Subject();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ConsulationdetailviewModel: Consulationdetailview;

  ngOnInit(): void{
    this.loadData();

  }

  ngOnDestroy() {
    //this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async loadData() {
    console.log("LoadConsulation");
    this.Meetingrow = JSON.parse(localStorage.getItem('meetingview')||'{}');
    this.Counselorrow = JSON.parse(localStorage.getItem('counselorview')||'{}');
    var Consulationdetailview_input = new Consulationdetailview();
    Consulationdetailview_input.meeting_id = this.Meetingrow.meeting_id;
    Consulationdetailview_input.consulation_id = this.Counselorrow.consulation_id;
    const subscribe = (this.ConsulationdetailviewService.GetConsulationdetail_byConsulation(Consulationdetailview_input)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.ConsulationdetailviewModel = data;
      console.log("Consulationdetail Data: "+this.ConsulationdetailviewModel);
    });
    this.subscriptions.push();
  }

  async openAddDialog(){
    console.log("openAddDialog");
    const dialogRef = await this.dialogService.open(ConsulationInsertdialogComponent, {
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

  async editItem(i: number, data: Consulationdetailview) {
    this.id = data.consulationdetail_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(ConsulationInsertdialogComponent, {
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
  
  addResponse(i: number, data: Consulationdetailview)
  {
    this.id = data.consulationdetail_id;
    this.index = i;
    this.Consulationrow = data;
    localStorage.setItem('consulationview', JSON.stringify(this.Counselorrow));
    console.log("SetItem : "+this.id)

    setTimeout(() => {
      this.Router.navigate(['/response'])
    }, 500);
    //[routerLink]="['/response']" << for html
  }

  backClicked() {
    setTimeout(() => {
      this.Router.navigate(['/counselor'])
    }, 500);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
