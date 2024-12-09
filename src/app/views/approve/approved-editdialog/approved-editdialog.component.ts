import { Component, OnInit, ElementRef, Input, Output, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ApprovedviewlistComponent } from '../approvedviewlist/approvedviewlist.component';
import { MeetingService } from '@app/services/meeting.service';
import { Meetingview } from '@app/models/meetingview';
import { Meeting } from '@app/models/meeting';
import { UserprofileService } from '@app/services/userprofile.service';
import { Userprofile } from '@app/models/userprofile';

@Component({
  selector: 'app-approved-editdialog',
  templateUrl: './approved-editdialog.component.html',
  styleUrls: ['./approved-editdialog.component.css']
})
export class ApprovedEditdialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ApprovedviewlistComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,
    public UserprofileService: UserprofileService,
    public MeetingService: MeetingService,
    

    @Inject(MAT_DIALOG_DATA) public AppovedViewModel: Meetingview,
  ) {}

  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  UserprofileModel : Userprofile[];

  frmGrpApprovedEdit : FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    this.loadData();
    this.frmGrpApprovedEdit = this.formBuilder.group({
      ddlowner: new FormControl({value: '', disabled: false}, [Validators.required])
    });
  }

  loadData() {
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    var userprofile =  new Userprofile()
    this.UserprofileService.DDLAssignOfficer(userprofile).subscribe(data => {this.UserprofileModel = data});
    this.loading = false;
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  get f() { return this.frmGrpApprovedEdit.controls; }

  refresh(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  async onSubmit() {
    if (this.frmGrpApprovedEdit.invalid){return;}
    var meetingData = new Meeting();

    meetingData = this.AppovedViewModel;
    meetingData.owner_id = this.frmGrpApprovedEdit.controls.ddlowner.value;
          
    (await this.MeetingService.SaveOwner(meetingData)).subscribe(data => {
      if (data == 0) {this.showWarning('ไม่สามารถบันทึกผู้รับผิดชอบได้');}
      else {this.showSuccess('บันทึกผู้รับผิดชอบเรียบร้อย');}
    });
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