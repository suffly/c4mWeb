import { Component, OnInit, inject, ElementRef, ViewChild, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { Userprofile } from '@app/models/userprofile';
import { GaconsulationviewService } from '@app/services/gaconsulationview.service';
import { Gaconsulationview } from '@app/models/gaconsulationview';
import { MinistryService } from '@app/services/ministry.service';
import { Ministry } from '@app/models/ministry';



@Component({
  selector: 'app-gaconsultationviewlist',
  templateUrl: './gaconsultationviewlist.component.html',
  styleUrls: ['./gaconsultationviewlist.component.css']
})
export class GaconsultationviewlistComponent implements OnInit, OnDestroy {

  constructor(
    public MinistryService: MinistryService,
    public GaconsulationviewService: GaconsulationviewService,
    private router: Router,
  ) {}
  

  Gameetingviewrow: number;
  Gacounselorviewrow: number;
  Gaconsulationviewrow: number;
  GaconsulationviewModel: Gaconsulationview[];
  MinistryModel: Ministry;
  dataSource = new MatTableDataSource<Gaconsulationview>();
  //displayedColumns: string[] = ['index', 'consulationdetail_topic', 'consulationdetail_detail', 'meeting_date', 'meetingset_desc', 'meeting_year', 'meeting_time', 'meetingterm_name', 'actions'];
  displayedColumns: string[] = ['index', 'consulationdetail_topic', 'meeting_date', 'counselor_fullname', 'status_name', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 20, 30, 40, 50, 100];
  index: number;
  id: number;

  subscriptions = [];
  private ngUnsubscribe = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  loading: boolean = false;
  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    localStorage.removeItem("meetingview");
    localStorage.removeItem("counselorview");
    localStorage.removeItem("consulationview");
    this.loadData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData(): void {
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');

    var Ministry_input = new Ministry;
    Ministry_input.ministry_id = this.currentUser.user_ministry;
    this.MinistryService.Getministry_byID(Ministry_input).subscribe(data => {this.MinistryModel = data});

    var Gaconsulationview_input = new Gaconsulationview;
    Gaconsulationview_input.ministry_id = this.currentUser.user_ministry;
    const subscribe = (this.GaconsulationviewService.Getgaconsulation_byministry(Gaconsulationview_input)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.GaconsulationviewModel = data;
      this.loading = false;
    });
    this.subscriptions.push();
    
  }

  viewDetail(i:number, data: Gaconsulationview) {
    this.id = data.consulationdetail_id;
    this.index = i;
    this.Gameetingviewrow = data.meeting_id;
    this.Gacounselorviewrow = data.consulation_id;
    this.Gaconsulationviewrow = data.consulationdetail_id;
    localStorage.setItem('meetingview', JSON.stringify(this.Gameetingviewrow));
    localStorage.setItem('counselorview', JSON.stringify(this.Gacounselorviewrow));
    localStorage.setItem('consulationview', JSON.stringify(this.Gaconsulationviewrow));

    setTimeout(() => {
      this.router.navigate(['/gaconsultationdetail'])
    }, 500);
    //[routerLink]="['/gaconsultationdetail']" << for html
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
