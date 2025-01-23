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

import { MinistryviewlistComponent } from '../ministryviewlist/ministryviewlist.component';

import { MinistryService } from '@app/services/ministry.service';
import { Ministry } from '@app/models/ministry';
import { Userprofile } from '@app/models/userprofile';

@Component({
  selector: 'app-ministry-insertdialog',
  templateUrl: './ministry-insertdialog.component.html',
  styleUrls: ['./ministry-insertdialog.component.css']
})
export class MinistryInsertdialogComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<MinistryviewlistComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,

    public MinistryService: MinistryService,

    @Inject(MAT_DIALOG_DATA) public MinistryModel: Ministry,
  ){}

  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  frmGrpAddministry : FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  protected _onDestroy = new Subject<void>();

  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    this.loadData();
    this.frmGrpAddministry = this.formBuilder.group({
      ministry_name: new FormControl({value: '', disabled: false}, Validators.required),
      ministry_head: new FormControl({value: '', disabled: false}, Validators.required),
      ministry_invitation: new FormControl({value: '', disabled: false}, Validators.required)
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
    if (this.frmGrpAddministry.invalid) {return;}
    
    var ministryData = new Ministry();
    ministryData.ministry_name = this.frmGrpAddministry.controls.ministry_name.value;
    ministryData.ministry_head = this.frmGrpAddministry.controls.ministry_head.value;
    ministryData.ministry_invitation = this.frmGrpAddministry.controls.ministry_invitation.value;

    if (this.MinistryModel.ministry_id == undefined)
    {
      this.MinistryService.Saveministry(ministryData).subscribe(data => {
        if(data == 0) {this.showWarning('ไม่สามารถบันทึกกระทรวงได้');}
        else {this.showSuccess('บันทึกกระทรวงเรียบร้อย');}
      });
    }
    else
    {
      ministryData.ministry_id = this.MinistryModel.ministry_id;
      (await this.MinistryService.Updateministry(ministryData)).subscribe(data => {
        if(data == 0) {this.showWarning('ไม่สามารถแก้ไขกระทรวงได้');}
        else {this.showSuccess('แก้ไขกระทรวงเรียบร้อย');}
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