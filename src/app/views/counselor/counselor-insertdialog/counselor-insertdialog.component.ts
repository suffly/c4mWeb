import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

import { CounselorviewlistComponent } from '../counselorviewlist/counselorviewlist.component';

import { Meetingview } from 'src/app/models/meetingview';
import { CounselorviewService } from '@app/services/counselorview.service';
import { Counselorview } from '@app/models/counselorview';
import { ConsulationviewService } from '@app/services/consulationview.service';
import { Consulationview } from '@app/models/consulationview';
import { Consulation } from '@app/models/consulation';
import { ConsulationService } from '@app/services/consulation.service';
import { Userprofile } from '@app/models/userprofile';

@Component({
  selector: 'app-counselor-insertdialog',
  templateUrl: './counselor-insertdialog.component.html',
  styleUrls: ['./counselor-insertdialog.component.css']
})
export class CounselorInsertdialogComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<CounselorviewlistComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,

    public CounselorviewService: CounselorviewService,
    public ConsulationviewService: ConsulationviewService,
    public ConsulationService: ConsulationService,
    
    @Inject(MAT_DIALOG_DATA) public ConsulationviewModel: Consulationview,
  ) {}

  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  Meetingrow:number;

  CounselorviewModel: Counselorview[];

  public CounselorviewFilter : FormControl = new FormControl();
  public FilteredCounselorview : ReplaySubject<Counselorview[]> = new ReplaySubject<Counselorview[]>(1);
  protected _onDestroy = new Subject<void>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  frmGrpAddCounselor: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    this.loadData();
    this.frmGrpAddCounselor = this.formBuilder.group({
      ddlcounselor: new FormControl({value: '', disabled: false}, [Validators.required])
    });
    if(this.ConsulationviewModel.counselor_id == undefined)
    {
      this.editable = false;
    }
    else
    {
      this.editable = true;
    }
    this.CounselorviewFilter.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.FilterCounselorview();});
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  loadData() {
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    this.Meetingrow = JSON.parse(localStorage.getItem('meetingview')||'{}');
    var Counselor = new Counselorview();
    //this.CounselorviewService.GetCounselorviewActive(Counselor).subscribe(data => {this.CounselorviewModel = data});
    this.loading = false;
  }

  async onSubmit() {
    if (this.frmGrpAddCounselor.invalid){return;}
    var consulationData = new Consulation();    
    consulationData.counselor_id = this.frmGrpAddCounselor.controls.ddlcounselor.value;
    if (this.ConsulationviewModel.consulation_id == undefined)
    {
      consulationData.meeting_id = this.Meetingrow;
      consulationData.create_by = this.currentUser.user_id;
      this.ConsulationService.SaveConsulation(consulationData).subscribe(data => {
        if (data == 0) {this.showWarning('ไม่สามารถบันทึกผู้หารือได้');}
        else {this.showSuccess('บันทึกผู้หารือเรียบร้อย');}
      });
    }
    else
    {
      consulationData.update_by = this.currentUser.user_id;
      consulationData.consulation_id = this.ConsulationviewModel.consulation_id;
      consulationData.meeting_id = this.ConsulationviewModel.meeting_id;
      consulationData.count_consulationdetail = this.ConsulationviewModel.count_consulationdetail;
      consulationData.create_date = this.ConsulationviewModel.create_date;
      consulationData.create_by = this.ConsulationviewModel.create_by;

      (await this.ConsulationService.UpdateConsulation(consulationData)).subscribe(data => {
        if (data == 0) {this.showWarning('ไม่สามารถแก้ไขผู้หารือได้');}
        else {this.showSuccess('แก้ไขผู้หารือเรียบร้อย');}
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
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
  get f() { return this.frmGrpAddCounselor.controls; }

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

  setInitialValue() {
    
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