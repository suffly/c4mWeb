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

import { ConsulationviewdetailComponent } from '../../consulationviewdetail/consulationviewdetail.component';

import { Consulationministryview } from '@app/models/consulationministryview';
import { MinistryService } from '@app/services/ministry.service';
import { Ministry } from '@app/models/ministry';
import { ConsulationministryService } from '@app/services/consulationministry.service';
import { Consulationministry } from '@app/models/consulationministry';

@Component({
  selector: 'app-consulationministry-insertdialog',
  templateUrl: './consulationministry-insertdialog.component.html',
  styleUrls: ['./consulationministry-insertdialog.component.css']
})
export class ConsulationministryInsertdialogComponent implements OnInit,AfterViewInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<ConsulationviewdetailComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,
    public MinistryService: MinistryService,
    public ConsulationministryService: ConsulationministryService,

    @Inject(MAT_DIALOG_DATA) public ConsulationministryviewModel: Consulationministryview,
  ) {}

  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  frmGrpAddMinistry: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  Meetingrow:number;
  Counselorrow: number;
  Consulationrow: number;

  MinistryModel: Ministry[];

  public MinistryFilter : FormControl = new FormControl();
  public FilteredMinistry : ReplaySubject<Ministry[]> = new ReplaySubject<Ministry[]>(1);
  protected _onDestroy = new Subject<void>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  ngOnInit(): void {
    this.loadData();
    this.frmGrpAddMinistry = this.formBuilder.group({
      ddlministry: new FormControl({value: '', disabled: false}, [Validators.required]),
    });

    if(this.ConsulationministryviewModel.consulationministry_id == undefined)
    {
      this.editable = false;
    }
    else
    {
      this.editable = true;
    }
    this.MinistryFilter.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.FilterMinistry();}); 

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
    this.Meetingrow = JSON.parse(localStorage.getItem('meetingview')||'{}');
    this.Counselorrow = JSON.parse(localStorage.getItem('counselorview')||'{}');
    this.Consulationrow = JSON.parse(localStorage.getItem('consulationview')||'{}');
    // var ministry_input = new Ministry();
    // this.MinistryService.DDLministry(ministry_input).subscribe(data =>{this.MinistryModel = data});
    this.loading = false;

  }

  async onSubmit() {
    if(this.frmGrpAddMinistry.invalid){return;}
    var consulationministryData = new Consulationministry();
    consulationministryData.ministry_id = this.frmGrpAddMinistry.controls.ddlministry.value;

    if(this.ConsulationministryviewModel.consulationministry_id == undefined)
    {
      consulationministryData.consulationdetail_id = this.Consulationrow;
      consulationministryData.consulation_id = this.Counselorrow;
      consulationministryData.meeting_id = this.Meetingrow;
      this.ConsulationministryService.SaveConsulationministry(consulationministryData).subscribe(data => {
        if(data == 0) {this.showWarning('ไม่สามารถบันทึกหน่วยงานที่เกี่ยวข้องได้');}
        else {this.showSuccess('บันทึกหน่วยงานที่เกี่ยวข้องเรียบร้อย');}
      });
    }
    else
    {
      consulationministryData.consulationministry_id = this.ConsulationministryviewModel.consulationministry_id
      consulationministryData.consulationdetail_id = this.ConsulationministryviewModel.consulationdetail_id;
      consulationministryData.consulation_id = this.ConsulationministryviewModel.consulation_id;
      consulationministryData.meeting_id = this.ConsulationministryviewModel.meeting_id;
      consulationministryData.status_id = this.ConsulationministryviewModel.status_id;
      (await this.ConsulationministryService.UpdateConsulationministry(consulationministryData)).subscribe(data => {
        if(data == 0) {this.showWarning('ไม่สามารถแก้ไขหน่วยงานที่เกี่ยวข้องได้');}
        else {this.showSuccess('แก้ไขหน่วยงานที่เกี่ยวข้องเรียบร้อย');}
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
  get f() { return this.frmGrpAddMinistry.controls; }

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
    
    var Minis = new Ministry();
    this.MinistryService.DDLministry(Minis).subscribe(data => {
      this.MinistryModel = data;
      this.FilteredMinistry.next(this.MinistryModel.slice());
    })
    this.FilteredMinistry.pipe(take(1), takeUntil(this._onDestroy)).subscribe(()=>{
      this.singleSelect.compareWith = (a: Ministry, b:Ministry) => a && b && a.ministry_id === b.ministry_id;
    });
  }

  FilterMinistry() {
    let search = this.MinistryFilter.value;
    if(!search)
    {
      this.FilteredMinistry.next(this.MinistryModel.slice());
      return;
    }
    else
    {
      search = search.toLowerCase();
    }
    this.FilteredMinistry.next(this.MinistryModel.filter(data => data.ministry_name.toLowerCase().indexOf(search) > -1));
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}