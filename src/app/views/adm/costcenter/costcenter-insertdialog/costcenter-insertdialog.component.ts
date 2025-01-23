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

import { CostcenterviewlistComponent } from '../costcenterviewlist/costcenterviewlist.component';

import { CostcenterService } from '@app/services/costcenter.service';
import { Costcenter } from '@app/models/costcenter';
import { Userprofile } from '@app/models/userprofile';

@Component({
  selector: 'app-costcenter-insertdialog',
  templateUrl: './costcenter-insertdialog.component.html',
  styleUrls: ['./costcenter-insertdialog.component.css']
})
export class CostcenterInsertdialogComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<CostcenterviewlistComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,

    public CostcenterService: CostcenterService,

    @Inject(MAT_DIALOG_DATA) public CostcenterModel: Costcenter,
  ){}

  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  frmGrpAddcostcenter : FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  protected _onDestroy = new Subject<void>();

  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    this.loadData();
    this.frmGrpAddcostcenter = this.formBuilder.group({
      costcenter_name: new FormControl({value: '', disabled: false}, Validators.required),
      costcenter_shortname: new FormControl({value: '', disabled: false}, Validators.required)
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  loadData() {
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    this.loading = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit() {
    if (this.frmGrpAddcostcenter.invalid) {return;}

    var costcenterData = new Costcenter();

    costcenterData.costcenter_name = this.frmGrpAddcostcenter.controls.costcenter_name.value;
    costcenterData.costcenter_shortname = this.frmGrpAddcostcenter.controls.costcenter_shortname.value;

    if (this.CostcenterModel.costcenter_id == undefined)
    {
      this.CostcenterService.Savecostcenter(costcenterData).subscribe(data => {
        if(data == 0) {this.showWarning('ไม่สามารถบันทึกหน่วยงานได้');}
        else {this.showSuccess('บันทึกหน่วยงานเรียบร้อย');}
      });
    }
    else
    {
      costcenterData.costcenter_id = this.CostcenterModel.costcenter_id;
      (await this.CostcenterService.Updatecostcenter(costcenterData)).subscribe(data => {
        if(data == 0) {this.showWarning('ไม่สามารถแก้ไขหน่วยงานได้');}
        else {this.showSuccess('แก้ไขหน่วยงานเรียบร้อย');}
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

  showSuccess(message: string) {
    this.toastr.success(message);
  }

  showWarning(message: string) {
    this.toastr.warning(message);
  }
  
}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}