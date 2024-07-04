import { Component, OnInit, inject, ElementRef, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { ResponseService } from '@app/services/response.service';
import { Response } from '@app/models/response';

import { ResponseInsertdialogComponent } from '@app/views/response/response-insertdialog/response-insertdialog.component';
import { ResponseDeletedialogComponent } from '@app/views/response/response-deletedialog/response-deletedialog.component';

@Component({
  selector: 'app-garesponseviewlist',
  templateUrl: './garesponseviewlist.component.html',
  styleUrls: ['./garesponseviewlist.component.css']
})
export class GaresponseviewlistComponent implements OnInit, OnDestroy {

  constructor(
    public ResponseService: ResponseService,
    public dialogService: MatDialog, 
    private router: Router,
    private cd: ChangeDetectorRef,
    ) {}

  Responserow: number;
  Consulationministryrow: number;                                                                                       
  ResponseModel: Response;
  dataSource = new MatTableDataSource<Response>();
  displayedColumns: string[] = ['index', 'response_topic', 'create_date', 'create_title', 'create_name', 'create_surname', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 20, 30];
  index: number;
  id: number;

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  ngOnInit(): void {
    localStorage.removeItem("response");
    this.loadData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData() {
    this.Consulationministryrow = JSON.parse(localStorage.getItem('consulationminitryview')||'{}');
    var Responseview_input = new Response();
    Responseview_input.consulationministry_id = this.Consulationministryrow;
    const subscribe = (this.ResponseService.GetResponse_byConsulationministry(Responseview_input)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.ResponseModel = data;
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

  addDetail(i:number, data: Response) {
    this.id = data.response_id;
    this.index = i;
    this.Responserow = data.response_id;
    localStorage.setItem('response', JSON.stringify(this.Responserow));

    setTimeout(() => {
      this.router.navigate(['/garesponsedetail'])
    }, 500);
    //[routerLink]="['/garesponse']" << for html
  }

  backClicked() {
    setTimeout(() => {
      this.router.navigate(['/gaconsultationdetail'])
    }, 500);
  }
}
