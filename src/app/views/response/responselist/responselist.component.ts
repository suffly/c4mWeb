import { Component, OnInit, inject, ElementRef, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { Meetingview } from '@app/models/meetingview';
import { Consulationview } from '@app/models/consulationview';
import { Consulationdetailview } from '@app/models/consulationdetailview';
import { ResponseService } from '@app/services/response.service';
import { Response } from '@app/models/response';

import { ResponseInsertdialogComponent } from '../response-insertdialog/response-insertdialog.component';
import { ResponseDeletedialogComponent } from '../response-deletedialog/response-deletedialog.component';



@Component({
  selector: 'app-responselist',
  templateUrl: './responselist.component.html',
  styleUrls: ['./responselist.component.css']
})
export class ResponselistComponent implements OnInit {

  constructor(
    public ResponseService: ResponseService,
    public dialogService: MatDialog, 
    private Router: Router,
    ) {}

  Meetingrow: number;
  Counselorrow: number;
  Consulationrow: number;
  Consulationministryrow: number;
  ResponseModel: Response;
  dataSource = new MatTableDataSource<Response>();
  displayedColumns: string[] = ['index', 'response_topic', 'create_date', 'create_title', 'create_name', 'create_surname', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 20, 30];
  index: number;
  id: number;

  subscriptions = [];
  private ngUnsubscribe = new Subject();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.Meetingrow = JSON.parse(localStorage.getItem('meetingview')||'{}');
    this.Counselorrow = JSON.parse(localStorage.getItem('counselorview')||'{}');
    this.Consulationrow = JSON.parse(localStorage.getItem('consulationview')||'{}');
    this.Consulationministryrow = JSON.parse(localStorage.getItem('consulationminitryview')||'{consulationminitryview}')
    console.log("LoadResponse, MeetingID : "+this.Meetingrow+" CounselorID : "+this.Counselorrow+" ConsulationID : "+this.Consulationrow+" CSLMID : "+this.Consulationministryrow);
    var Responseview_input = new Response();
    Responseview_input.meeting_id = this.Meetingrow;
    Responseview_input.consulation_id = this.Counselorrow;
    Responseview_input.consulationdetail_id = this.Consulationrow;
    Responseview_input.consulationministry_id = this.Consulationministryrow;
    const subscribe = (this.ResponseService.GetResponse_byConsulationministry(Responseview_input)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.ResponseModel = data;
      console.log("Response Data : "+this.ResponseModel);
    });
    this.subscriptions.push();
  }

  async openAddDialog(){
    const dialogRef = await this.dialogService.open(ResponseInsertdialogComponent, {
      width: '640px',
      height: '640px',
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

  async editItem(i: number, data: Response) {
    this.id = data.response_id;
    this.index = i;
    const dialogRef = await this.dialogService.open(ResponseInsertdialogComponent, {
      width: '640px',
      height: '640px',
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

  async deleteItem(i: number, data: Response) {
    const dialogRef = await this.dialogService.open(ResponseDeletedialogComponent, {
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
      this.Router.navigate(['/consulationdetail'])
    }, 500);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
