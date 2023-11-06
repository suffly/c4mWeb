import { Component, inject, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

import { CounselordivisionService } from 'src/app/services/counselordivision.service';
import { Counselordivision } from 'src/app/models/counselordivision';
import { CounselortypeService } from 'src/app/services/counselortype.service';
import { Counselortype } from 'src/app/models/counselortype';
import { MeetingtermService } from 'src/app/services/meetingterm.service';
import { Meetingterm } from 'src/app/models/meetingterm';
import { MeetingtypeService } from 'src/app/services/meetingtype.service';
import { Meetingtype } from 'src/app/models/meetingtype';
import { MinistryService } from 'src/app/services/ministry.service';
import { Ministry } from 'src/app/models/ministry';
import { ObjectiveService } from 'src/app/services/objective.service';
import { Objective } from 'src/app/models/objective';
import { PartylistService } from 'src/app/services/partylist.service';
import { Partylist } from 'src/app/models/partylist';
import { ProvinceService } from 'src/app/services/province.service';
import { Province } from 'src/app/models/province';
import { RegionService } from 'src/app/services/region.service';
import { Region } from 'src/app/models/region';
import { TopictypeService } from 'src/app/services/topictype.service';
import { Topictype } from 'src/app/models/topictype';
import { MeetingService} from 'src/app/services/meeting.service';
import { Meeting } from 'src/app/models/meeting';
import { MeetingviewService } from 'src/app/services/meetingview.service';
import { Meetingview } from 'src/app/models/meetingview';
import { CounselorviewService } from 'src/app/services/counselorview.service';
import { Counselorview } from 'src/app/models/counselorview';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
//-- set value for select search AfterViewInit, OnDestroy
export class HomeComponent implements OnInit {

  CounselordivisionModel : Counselordivision[];
  CounselortypeModel : Counselortype[];
  MeetingtermModel : Meetingterm[];
  MeetingtypeModel : Meetingtype[];
  MinistryModel : Ministry[];
  ObjectiveModel : Objective[];
  PartylistModel : Partylist[];
  ProvinceModel : Province[];
  RegionModel : Region[];
  TopictypeModel : Topictype[];
  MeetingModel : Meeting[];
  MeetingviewModel : Meetingview[];
  CounselorviewModel : Counselorview[];

  //-- set value for select search
  public CounselorviewFilter : FormControl = new FormControl();
  public FilteredCounselorview : ReplaySubject<Counselorview[]> = new ReplaySubject<Counselorview[]>(1);
  protected _onDestroy = new Subject<void>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  //-- set value for select search

  dataSource = new MatTableDataSource<Meetingview>();
  displayedColumns: string[] = ['index', 'meetingtype_name', 'meeting_set', 'meeting_year', 'meetingterm_name', 'meeting_date', 'create_name', 'create_date', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 25, 50];
  index: number;
  id: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;



  constructor(
    public CounselordivisionService: CounselordivisionService,
    public CounselortypeService: CounselortypeService,
    public MeetingtermService: MeetingtermService,
    public MeetingtypeService: MeetingtypeService,
    public MinistryService: MinistryService,
    public ObjectiveService: ObjectiveService,
    public PartylistService: PartylistService,
    public ProvinceService: ProvinceService,
    public RegionService: RegionService,
    public TopictypeService: TopictypeService,
    public MeetingService: MeetingService,
    public MeetingviewService: MeetingviewService,
    public CounselorviewService: CounselorviewService,
    
    public dialogService: MatDialog, 
    private Router: Router,
    private toastr: ToastrService,

    ) {}


  ngOnInit(): void{
    this.loaddata();

    //-- set value for select search
    // this.CounselorviewFilter.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.FilterCounselorview();}); 

  }

  // //-- set value for select search
  // ngAfterViewInit() {
  //   this.setInitialValue();
  // }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  //-- set value for select search
  
  loaddata(){
    
    
  }

  // //-- set value for select search
  // setInitialValue() {
    
  //   var Counselor = new Counselorview();
  //   this.CounselorviewService.GetCounselorviewActive(Counselor).subscribe(data => {
  //     this.CounselorviewModel = data;
  //     this.FilteredCounselorview.next(this.CounselorviewModel.slice());
  //   })
  //   this.FilteredCounselorview.pipe(take(1), takeUntil(this._onDestroy)).subscribe(()=>{
  //     this.singleSelect.compareWith = (a: Counselorview, b:Counselorview) => a && b && a.counselor_id === b.counselor_id;
  //   });
  // }

  // FilterCounselorview() {
  //   let search = this.CounselorviewFilter.value;
  //   if(!search)
  //   {
  //     this.FilteredCounselorview.next(this.CounselorviewModel.slice());
  //     return;
  //   }
  //   else
  //   {
  //     search = search.toLowerCase();
  //   }
  //   this.FilteredCounselorview.next(this.CounselorviewModel.filter(data => data.counselor_name.toLowerCase().indexOf(search) > -1));
  // }
  // //-- set value for select search

}
