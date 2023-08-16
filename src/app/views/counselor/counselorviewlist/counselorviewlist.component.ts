import { Component, OnInit, inject, ElementRef, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { Meetingview } from 'src/app/models/meetingview';
import { ConsulationviewService } from '@app/services/consulationview.service';
import { Consulationview } from '@app/models/consulationview';

import { CounselorInsertdialogComponent } from '../counselor-insertdialog/counselor-insertdialog.component';
import { CounselorDeletedialogComponent } from '../counselor-deletedialog/counselor-deletedialog.component';


@Component({
  selector: 'app-counselorviewlist',
  templateUrl: './counselorviewlist.component.html',
  styleUrls: ['./counselorviewlist.component.css']
})
export class CounselorviewlistComponent implements OnInit, OnDestroy {

  constructor(
    public ConsulationviewService: ConsulationviewService,
    public dialogService: MatDialog, 
    private Router: Router,
    ) {}
  
  Meetingrow : Meetingview;
  Counselorrow: Consulationview;
  dataSource = new MatTableDataSource<Consulationview>();
  displayedColumns: string[] = ['index', 'counselor_title', 'counselor_name', 'counselor_middlename', 'counselor_surname', 'counselortype_name', 'partylist_name', 'counselordivision_name', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 20, 30];
  index: number;
  id: number;

  subscriptions = [];
  private ngUnsubscribe = new Subject();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ConsulationviewModel :Consulationview[];


  ngOnInit(): void{
    this.loadData();

  }

  ngOnDestroy() {
    //this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async loadData(){ 
    console.log("LoadCouselor");
    this.Meetingrow = JSON.parse(localStorage.getItem('meetingview')||'{}');
    var Consulationview_input = new Consulationview();
    Consulationview_input.meeting_id = this.Meetingrow.meeting_id
    const subscribe = (this.ConsulationviewService.Getconsulationview_byMeeting(Consulationview_input)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.ConsulationviewModel = data;
      console.log("Consulation Data: "+this.ConsulationviewModel);
    });
    this.subscriptions.push();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async openAddDialog(){
    console.log("openAddDialog");
    const dialogRef = await this.dialogService.open(CounselorInsertdialogComponent, {
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

  async editItem(i: number, data: Consulationview) {
    this.id = data.consulation_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(CounselorInsertdialogComponent, {
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

  async deleteItem(i: number, data: Consulationview) {
    const dialogRef = await this.dialogService.open(CounselorDeletedialogComponent, {
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

  backClicked() {
    setTimeout(() => {
      this.Router.navigate(['/meeting'])
    }, 500);
  }

  addConsulation(i: number, data: Consulationview)
  {
    this.id = data.consulation_id;
    this.index = i;
    this.Counselorrow = data;
    localStorage.setItem('counselorview', JSON.stringify(this.Counselorrow));
    console.log("SetItem : "+this.id)

    setTimeout(() => {
      this.Router.navigate(['/consulation'])
    }, 500);
    //[routerLink]="['/consulation']" << for html
  }


}
