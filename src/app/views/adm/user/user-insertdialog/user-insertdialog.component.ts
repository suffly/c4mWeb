import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { Observable} from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { UserviewlistComponent } from '../userviewlist/userviewlist.component';

import { UserprofileService } from '@app/services/userprofile.service';
import { Userprofile } from '@app/models/userprofile';
import { Userprofileview } from '@app/models/userprofileview';

import { UserlevelService } from '@app/services/userlevel.service';
import { Userlevel } from '@app/models/userlevel';
import { CostcenterService } from '@app/services/costcenter.service';
import { Costcenter } from '@app/models/costcenter';
import { UsertypeService } from '@app/services/usertype.service';
import { Usertype } from '@app/models/usertype';

import { CounselorviewService } from '@app/services/counselorview.service';
import { Counselorview } from '@app/models/counselorview';
import { MinistryService } from '@app/services/ministry.service';
import { Ministry } from '@app/models/ministry';




interface DDLUserStatus {
  value : number;
  viewvalue : string;
}

@Component({
  selector: 'app-user-insertdialog',
  templateUrl: './user-insertdialog.component.html',
  styleUrls: ['./user-insertdialog.component.css']
})
export class UserInsertdialogComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<UserviewlistComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,

    public UserprofileService:UserprofileService,
    public UserlevelService:UserlevelService,
    public CostcenterService:CostcenterService,
    public UsertypeService:UsertypeService,
    public CounselorviewService:CounselorviewService,
    public MinistryService:MinistryService,

    @Inject(MAT_DIALOG_DATA) public UserprofileModel: Userprofileview,
  ) {}

  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  DDLUserStatus : DDLUserStatus[] = [
    {value: 0, viewvalue: "Inactive"},
    {value: 1, viewvalue: "Active"}
  ]

  titleOptions: string[] = [
    'นาย',
    'นาง',
    'นางสาว'
  ]
  filteredTitleOptions: Observable<string[]>;

  UserlevelModel : Userlevel[];
  CostcenterModel : Costcenter[];
  UsertypeModel : Usertype[];
  CounselorviewModel : Counselorview[];
  MinistryModel : Ministry[];

  public CounselorviewFilter : FormControl = new FormControl();
  public FilteredCounselorview : ReplaySubject<Counselorview[]> = new ReplaySubject<Counselorview[]>(1);
  protected _onDestroy = new Subject<void>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  frmGrpAddUser : FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    this.loadData();
    this.frmGrpAddUser = this.formBuilder.group({
      user_login: new FormControl({value: '', disabled: false}, [Validators.required]),
      user_password: new FormControl({value: '', disabled: false}),
      user_cid: new FormControl({value: '', disabled: false}, [Validators.pattern(/^[0-9]\d*$/)]),
      user_title: new FormControl({value: '', disabled: false}, [Validators.required]),
      user_name: new FormControl({value: '', disabled: false}, [Validators.required]),
      user_midname: new FormControl({value: '', disabled: false}),
      user_surname: new FormControl({value: '', disabled: false}, [Validators.required]),
      user_position: new FormControl({value: '', disabled: false}, [Validators.required]),
      ddluserlevel: new FormControl({value: '', disabled: false}, [Validators.required]),
      ddlcostcenter: new FormControl({value: '', disabled: false}, [Validators.required]),
      ddlusertype: new FormControl({value: '', disabled: false}, [Validators.required]),
      ddluserstatus: new FormControl({value: '', disabled: false}, [Validators.required]),
      user_email: new FormControl({value: '', disabled: false}, [Validators.required]),
      ddlusermember: new FormControl({value: '', disabled: false}),
      ddluserministry: new FormControl({value: '', disabled: false})
    });

    if(this.UserprofileModel.user_id == undefined)
    {
      this.editable = false;    
    }
    else
    {
      this.editable = true;
    };

    this.filteredTitleOptions = this.frmGrpAddUser.controls['user_title'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''),)
    );

    this.CounselorviewFilter.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.FilterCounselorview();});
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.titleOptions.filter(titleOptions => titleOptions.toLowerCase().includes(filterValue));
  }

  ngAfterViewInit() {
    this.setInitialCounselorValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  loadData(){
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    var userlevel = new Userlevel();
    this.UserlevelService.DDLuserlevel(userlevel).subscribe(data => {this.UserlevelModel = data});
    var costcenter = new Costcenter();
    this.CostcenterService.DDLcostcenter(costcenter).subscribe(data => {this.CostcenterModel = data});
    var usertype = new Usertype();
    this.UsertypeService.DDLusertype(usertype).subscribe(data => {this.UsertypeModel = data});
    var ministry = new Ministry();
    this.MinistryService.DDLministry(ministry).subscribe(data => {this.MinistryModel = data});
    this.loading = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit() {
    if (this.frmGrpAddUser.invalid){return;}

    var userprofileData = new Userprofile();
    // userprofileData = this.UserprofileModel;

    userprofileData.user_login = this.frmGrpAddUser.controls.user_login.value;
    userprofileData.user_password = this.frmGrpAddUser.controls.user_password.value;
    userprofileData.user_cid = this.frmGrpAddUser.controls.user_cid.value;
    userprofileData.user_title = this.frmGrpAddUser.controls.user_title.value;
    userprofileData.user_name =this.frmGrpAddUser.controls.user_name.value;
    userprofileData.user_midname = this.frmGrpAddUser.controls.user_midname.value;
    userprofileData.user_surname = this.frmGrpAddUser.controls.user_surname.value;
    userprofileData.user_position = this.frmGrpAddUser.controls.user_position.value;
    userprofileData.userlevel_id = this.frmGrpAddUser.controls.ddluserlevel.value;
    userprofileData.costcenter_id = this.frmGrpAddUser.controls.ddlcostcenter.value;
    userprofileData.usertype_id = this.frmGrpAddUser.controls.ddlusertype.value;
    userprofileData.user_status = this.frmGrpAddUser.controls.ddluserstatus.value;
    userprofileData.user_email = this.frmGrpAddUser.controls.user_email.value;
    userprofileData.user_member = this.frmGrpAddUser.controls.ddlusermember.value;
    userprofileData.user_ministry = this.frmGrpAddUser.controls.ddluserministry.value;
  
    if(this.UserprofileModel.user_id == undefined)
    {
      this.UserprofileService.Saveuserprofile(userprofileData).subscribe(data => {
        if(data == 0) {this.showWarning('ไม่สามารถบันทึกผู้ใช้งานได้');}
        else {this.showSuccess('บันทึกผู้ใช้งานเรียบร้อย');}
      });
    }
    else
    {
      userprofileData.user_id = this.UserprofileModel.user_id;
      console.log(userprofileData);
      (await this.UserprofileService.Updateuserprofile(userprofileData)).subscribe(data => {
        if(data == 0) {this.showWarning('ไม่สามารถแก้ไขผู้ใช้งานได้');}
        else {this.showSuccess('แก้ไขผู้ใช้งานเรียบร้อย');}
      });
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Success', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
    this._snackBar.open(message, 'Warning', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  get f() { return this.frmGrpAddUser.controls; }

  refresh(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  showSuccess(message: string) {
    this.toastr.success(message);
  }

  showWarning(message: string) {
    this.toastr.warning(message);
  }

  setInitialCounselorValue() {
    var Counselor = new Counselorview();
    this.CounselorviewService.GetCounselorviewActive(Counselor).subscribe(data => {
      this.CounselorviewModel = data;
      this.FilteredCounselorview.next(this.CounselorviewModel.slice());
    })
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

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}