import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


import { Userprofile } from '@app/models/userprofile';

@Component({
  selector: 'app-user-insertdialog',
  templateUrl: './user-insertdialog.component.html',
  styleUrls: ['./user-insertdialog.component.css']
})
export class UserInsertdialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UserInsertdialogComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,

  ) {}

  matcher = new MyErrorStateMatcher();
  frmGrpAddUser : FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    this.loadData();
    this.frmGrpAddUser = this.formBuilder.group({
      
    });
  }

  loadData(){
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
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