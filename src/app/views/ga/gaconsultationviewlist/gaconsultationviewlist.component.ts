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


@Component({
  selector: 'app-gaconsultationviewlist',
  templateUrl: './gaconsultationviewlist.component.html',
  styleUrls: ['./gaconsultationviewlist.component.css']
})
export class GaconsultationviewlistComponent implements OnInit, OnDestroy {

  constructor(
    public GaconsulationviewService: GaconsulationviewService,
    private router: Router,
  ) {}
  
  Gaconsulationviewrow: number;
  GaconsulationviewModel: Gaconsulationview[];
  dataSource = new MatTableDataSource<Gaconsulationview>();
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
    localStorage.removeItem("gaconsultation");
    this.loadData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData(): void {
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    var Gaconsulationview_input = new Gaconsulationview;
    Gaconsulationview_input.ministry_id = this.currentUser.user_ministry;
    const subscribe = (this.GaconsulationviewService.Getgaconsulation_byministry(Gaconsulationview_input)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.GaconsulationviewModel = data;
    });
    this.subscriptions.push();
  }

  viewDetail(i:number, data: Gaconsulationview) {
    this.id = data.consulationdetail_id;
    this.index = i;
    this.Gaconsulationviewrow = data.consulationdetail_id;
    localStorage.setItem('gaconsultation', JSON.stringify(this.Gaconsulationviewrow));

    setTimeout(() => {
      this.router.navigate(['/gaconsultationdetail'])
    }, 500);
    //[routerLink]="['/gaconsultationdetail']" << for html
  }

}
