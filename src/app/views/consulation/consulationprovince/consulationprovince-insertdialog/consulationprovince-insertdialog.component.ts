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

import { Consulationprovinceview } from '@app/models/consulationprovinceview';
import { ProvinceService } from '@app/services/province.service';
import { Province } from '@app/models/province';
import { ConsulationprovinceService } from '@app/services/consulationprovince.service';
import { Consulationprovince } from '@app/models/consulationprovince';
import { Userprofile } from '@app/models/userprofile';

@Component({
  selector: 'app-consulationprovince-insertdialog',
  templateUrl: './consulationprovince-insertdialog.component.html',
  styleUrls: ['./consulationprovince-insertdialog.component.css']
})
export class ConsulationprovinceInsertdialogComponent implements OnInit,AfterViewInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<ConsulationviewdetailComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,
    public ProvinceService: ProvinceService,
    public ConsulationprovinceService: ConsulationprovinceService,

    @Inject(MAT_DIALOG_DATA) public ConsulationprovinceviewModel: Consulationprovinceview,
  ) {}

  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  frmGrpAddProvince: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  Meetingrow:number;
  Counselorrow: number;
  Consulationrow: number;

  ProvinceModel: Province[];

  public ProvinceFilter : FormControl = new FormControl();
  public FilteredProvince : ReplaySubject<Province[]> = new ReplaySubject<Province[]>(1);
  protected _onDestroy = new Subject<void>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    this.loadData();
    this.frmGrpAddProvince = this.formBuilder.group({
      ddlprovince: new FormControl({value: '', disabled: false}, [Validators.required]),
    });

    if(this.ConsulationprovinceviewModel.consulationprovince_id == undefined)
    {
      this.editable = false;
    }
    else
    {
      this.editable = true;
    }
    this.ProvinceFilter.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.FilterProvince();}); 
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  loadData(){
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    this.Meetingrow = JSON.parse(localStorage.getItem('meetingview')||'{}');
    this.Counselorrow = JSON.parse(localStorage.getItem('counselorview')||'{}');
    this.Consulationrow = JSON.parse(localStorage.getItem('consulationview')||'{}');
    this.loading = false;
  }

  async onSubmit() {
    if(this.frmGrpAddProvince.invalid){return;}
    var consulationprovinceData = new Consulationprovince();
    
    consulationprovinceData = this.ConsulationprovinceviewModel;
    consulationprovinceData.province_id = this.frmGrpAddProvince.controls.ddlprovince.value;

    if(this.ConsulationprovinceviewModel.consulationprovince_id == undefined)
    {
      consulationprovinceData.create_by = this.currentUser.user_id;
      consulationprovinceData.consulationdetail_id = this.Consulationrow;
      consulationprovinceData.consulation_id = this.Counselorrow;
      consulationprovinceData.meeting_id = this.Meetingrow;

      this.ConsulationprovinceService.SaveConsulationprovince(consulationprovinceData).subscribe(data =>{
        if(data == 0) {this.showWarning('ไม่สามารถบันทึกจังหวัดได้')}
        else {this.showSuccess('บันทึกจังหวัดเรียบร้อย')}
      });
    }
    else
    {
      consulationprovinceData.update_by = this.currentUser.user_id;

      (await this.ConsulationprovinceService.UpdateConsulationprovince(consulationprovinceData)).subscribe(data => {
        if(data == 0) {this.showWarning('ไม่สามารถแก้ไขจังหวัดได้')}
        else {this.showSuccess('แก้ไขจังหวัดเรียบร้อย')}
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
  get f() { return this.frmGrpAddProvince.controls; }

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
    
    var Provi = new Province();
    this.ProvinceService.DDLprovince(Provi).subscribe(data => {
      this.ProvinceModel = data;
      this.FilteredProvince.next(this.ProvinceModel.slice());
    })
    this.FilteredProvince.pipe(take(1), takeUntil(this._onDestroy)).subscribe(()=>{
      this.singleSelect.compareWith = (a: Province, b:Province) => a && b && a.province_id === b.province_id;
    });
  }

  FilterProvince() {
    let search = this.ProvinceFilter.value;
    if(!search)
    {
      this.FilteredProvince.next(this.ProvinceModel.slice());
      return;
    }
    else
    {
      search = search.toLowerCase();
    }
    this.FilteredProvince.next(this.ProvinceModel.filter(data => data.province_name.toLowerCase().indexOf(search) > -1));
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}