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

export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

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

  
  public CounselorviewFilter : FormControl = new FormControl();
  public FilteredCounselorview : ReplaySubject<Counselorview[]> = new ReplaySubject<Counselorview[]>(1);
  protected _onDestroy = new Subject<void>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  dataSource = new MatTableDataSource<Meetingview>();
  displayedColumns: string[] = ['index', 'meetingtype_name', 'meeting_set', 'meeting_year', 'meetingterm_name', 'meeting_date', 'create_name', 'create_date', 'actions'];
  pageSize: number = 10;
  pageSizeOptions = [10, 25, 50];
  index: number;
  id: number;
  //subscriptions = [];
  //private ngUnsubscribe = new Subject();
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

  // ngOnDestroy() {
  //   this.ngUnsubscribe.next();
  //   this.ngUnsubscribe.complete();
  // }

  ngOnInit(): void{
    this.loaddata();
    // var Counselor = new Counselorview();
    // this.CounselorviewService.GetCounselorviewActive(Counselor).subscribe(data => {
    //   this.CounselorviewModel = data;
    //   this.FilteredCounselorview.next(this.CounselorviewModel.slice());
    //   console.log(this.CounselorviewModel);
    // })
    //this.FilteredCounselorview.next(this.CounselorviewModel.slice());
    this.CounselorviewFilter.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.FilterCounselorview();}); 

  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  loaddata(){
    
    // var Coundivision = new Counselordivision();
    // this.CounselordivisionService.DDLcounselordivision(Coundivision).subscribe(data => {this.CounselordivisionModel = data 
    //   console.log(this.CounselordivisionModel);
    // });

    // var Countype = new Counselortype();
    // this.CounselortypeService.DDLcounselortype(Countype).subscribe(data => {this.CounselortypeModel = data
    //   console.log(this.CounselortypeModel);
    // });

    // var Meetterm = new Meetingterm();
    // this.MeetingtermService.DDLmeetingterm(Meetterm).subscribe(data => {this.MeetingtermModel = data
    //   console.log(this.MeetingtermModel);
    // });

    // var Meettype = new Meetingtype();
    // this.MeetingtypeService.DDLmeetingtype(Meettype).subscribe(data => {this.MeetingtypeModel = data
    //   console.log(this.MeetingtypeModel);
    // });

    // var Minis = new Ministry();
    // this.MinistryService.DDLministry(Minis).subscribe(data => {this.MinistryModel = data
    //   console.log(this.MinistryModel);
    // });

    // var Object = new Objective();
    // this.ObjectiveService.DDLobjective(Object).subscribe(data => {this.ObjectiveModel = data
    //   console.log(this.ObjectiveModel);
    // });

    // var Party = new Partylist();
    // this.PartylistService.DDLpartylist(Party).subscribe(data => {this.PartylistModel = data
    //   console.log(this.PartylistModel);
    // });

    // var Provinc = new Province();
    // this.ProvinceService.DDLprovince(Provinc).subscribe(data => {this.ProvinceModel = data
    //   console.log(this.ProvinceModel);
    // });

    var Regi = new Region();
    this.RegionService.DDLregion(Regi).subscribe(data => {this.RegionModel = data
      //console.log(this.RegionModel);
    });

    var Topic = new Topictype();
    this.TopictypeService.DDLtopictype(Topic).subscribe(data => {this.TopictypeModel = data
      //console.log(this.TopictypeModel);
    });

    

    // var Meet = new Meeting();
    // this.MeetingService.GetMetting_All(Meet).subscribe(data => {
    //   this.MeetingModel = data
    //   this.dataSource.data = data;
    //   this.dataSource.paginator = this.paginator;

    //   console.log(this.MeetingModel);

    // });

    // var Meetview = new Meetingview();
    // this.MeetingviewService.Getmeetingview_All(Meetview).subscribe(data => {
    //   this.MeetingviewModel = data;
    //   this.dataSource.data = data;
    //   this.dataSource.paginator = this.paginator;
    //   console.log(this.MeetingviewModel);
    // })

  }

  setInitialValue() {
    
    var Counselor = new Counselorview();
    this.CounselorviewService.GetCounselorviewActive(Counselor).subscribe(data => {
      this.CounselorviewModel = data;
      this.FilteredCounselorview.next(this.CounselorviewModel.slice());
    })
    console.log(this.FilteredCounselorview);
    this.FilteredCounselorview.pipe(take(1), takeUntil(this._onDestroy)).subscribe(()=>{
      this.singleSelect.compareWith = (a: Counselorview, b:Counselorview) => a && b && a.counselor_id === b.counselor_id;
    });
  }

  FilterCounselorview() {
    let search = this.CounselorviewFilter.value;
    if(!search)
    {
      this.FilteredCounselorview.next(this.CounselorviewModel.slice());
      return;
    }
    else
    {
      search = search.toLowerCase();
    }
    this.FilteredCounselorview.next(this.CounselorviewModel.filter(data => data.counselor_name.toLowerCase().indexOf(search) > -1));
  }

}
