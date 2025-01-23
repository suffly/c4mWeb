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

import { PartylistviewlistComponent } from '../partylistviewlist/partylistviewlist.component';

import { PartylistService } from '@app/services/partylist.service';
import { Partylist } from '@app/models/partylist';
import { Partylistview } from '@app/models/partylistview';
import { Userprofile } from '@app/models/userprofile';

import { CounselordivisionService } from '@app/services/counselordivision.service';
import { Counselordivision } from '@app/models/counselordivision';


@Component({
  selector: 'app-partylist-insertdialog',
  templateUrl: './partylist-insertdialog.component.html',
  styleUrls: ['./partylist-insertdialog.component.css']
})
export class PartylistInsertdialogComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<PartylistviewlistComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,

    public PartylistService: PartylistService,
    public CounselordivisionService: CounselordivisionService,
    

    @Inject(MAT_DIALOG_DATA) public PartylistviewModel: Partylistview,
  ) {}

  loading: boolean = true;
  editable: boolean = false;
  matcher = new MyErrorStateMatcher();

  CounselordivisionModel: Counselordivision[];

  frmGrpAddpartylist : FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  protected _onDestroy = new Subject<void>();

  currentUser: Userprofile;
  private readonly CURRENT_USER = 'currentUser';



  ngOnInit(): void {
    this.loadData();
    this.frmGrpAddpartylist = this.formBuilder.group({
      partylist_name: new FormControl({value: '', disabled: false}, Validators.required),
      ddlcounselordivision: new FormControl({value: '', disabled: false}, Validators.required)
    });

    if(this.PartylistviewModel.partylist_id == undefined)
    {
      this.editable = false;
    }
    else
    {
      this.editable = true;
    };
  }
  

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  loadData(){
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    var counselordivision =new Counselordivision();
    this.CounselordivisionService.DDLcounselordivision(counselordivision).subscribe(data => {this.CounselordivisionModel = data});
    this.loading = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSubmit() {
    if (this.frmGrpAddpartylist.invalid) {return;}

    var partylistData = new Partylist();

    partylistData.partylist_name = this.frmGrpAddpartylist.controls.partylist_name.value;
    partylistData.counselordivision_id = this.frmGrpAddpartylist.controls.ddlcounselordivision.value;
    
    if(this.PartylistviewModel.partylist_id == undefined)
    {
      this.PartylistService.Savepartylist(partylistData).subscribe(data => {
        if(data == 0) {this.showWarning('ไม่สามารถบันทึกพรรคการเมืองได้');}
        else {this.showSuccess('บันทึกพรรคการเมืองเรียบร้อย');}
      });
    }
    else
    {
      partylistData.partylist_id = this.PartylistviewModel.partylist_id;
      (await this.PartylistService.Updatepartylist(partylistData)).subscribe(data => {
        if(data == 0) {this.showWarning('ไม่สามารถแก้ไขพรรคการเมืองได้');}
        else {this.showSuccess('แก้ไขพรรคการเมืองเรียบร้อย');}
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