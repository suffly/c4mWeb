import { Component, OnInit, inject, ElementRef, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { Userprofile } from '@app/models/userprofile';
import { MpconsulationviewService } from '@app/services/mpconsulationview.service';
import { Mpconsulationview } from '@app/models/mpconsulationview';


@Component({
  selector: 'app-mpconsultationviewlist',
  templateUrl: './mpconsultationviewlist.component.html',
  styleUrls: ['./mpconsultationviewlist.component.css']
})
export class MpconsultationviewlistComponent implements OnInit {

  constructor(
    public MpconsulationviewService: MpconsulationviewService,
    private Router: Router,
  ) {}

  Mpconsultationrow: number;
  MpconsultationModel: Mpconsulationview[];
  dataSource = new MatTableDataSource<Mpconsulationview>();
  displayedColumns: string[] = ['index', 'consulationdetail_topic', 'consulationdetail_detail', 'meeting_date', 'meetingset_desc', 'meeting_year', 'meeting_time', 'meetingterm_name', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 20, 30, 40, 50, 100];
  index: number;
  id: number;

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  loading: boolean = true;
  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    localStorage.removeItem("mpconsultation");
    this.loadData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData(): void {
    //this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    var Mpconsultation_input = new Mpconsulationview;
    Mpconsultation_input.counselor_id = this.currentUser.user_member;
    const subscribe = (this.MpconsulationviewService.Getmpconsulation_bymp(Mpconsultation_input)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.MpconsultationModel = data;
    });
    this.subscriptions.push();
    //this.loading = false;
  }

  viewDetail(i:number, data: Mpconsulationview) {
    this.id = data.consulationdetail_id;
    this.index = i;
    this.Mpconsultationrow = data.consulationdetail_id;
    localStorage.setItem('mpconsultation', JSON.stringify(this.Mpconsultationrow));

    setTimeout(() => {
      this.Router.navigate(['/mpconsultationdetail'])
    }, 500);
    //[routerLink]="['/mpconsultationdetail']" << for html
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
