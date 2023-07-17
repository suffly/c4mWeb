import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';

import { MeetingviewlistComponent } from '../meetingviewlist/meetingviewlist.component';

import { MeetingtermService } from 'src/app/services/meetingterm.service';
import { Meetingterm } from 'src/app/models/meetingterm';
import { MeetingtypeService } from 'src/app/services/meetingtype.service';
import { Meetingtype } from 'src/app/models/meetingtype';



@Component({
  selector: 'app-meeting-insertdialog',
  templateUrl: './meeting-insertdialog.component.html',
  styleUrls: ['./meeting-insertdialog.component.css']
})
export class MeetingInsertdialogComponent {

  constructor(
    public dialogRef: MatDialogRef<MeetingviewlistComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,

    public MeetingtermService: MeetingtermService,
    public MeetingtypeService: MeetingtypeService,

  ) {}

  loading = true;
  
  MeetingtermModel : Meetingterm[];
  MeetingtypeModel : Meetingtype[];

  
  frmGrpAddMeeting : FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  ngOnInit(): void {

    this.frmGrpAddMeeting = this.formBuilder.group({

    });

  }

  loadData() {
    this.loading = true;
    var Meetterm = new Meetingterm();
    this.MeetingtermService.DDLmeetingterm(Meetterm).subscribe(data => {this.MeetingtermModel = data});

    var Meettype = new Meetingtype();
    this.MeetingtypeService.DDLmeetingtype(Meettype).subscribe(data => {this.MeetingtypeModel = data});
    this.loading = false;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Success', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  showSuccess(message: string) {
    //this.toastr.success(message);
  }

  showWarning(message: string) {
    //this.toastr.warning(message);
  }


}
