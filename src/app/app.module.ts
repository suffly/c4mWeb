import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { HttpErrorInterceptor } from './interceptor/http-error.interceptor';
import { ToastrModule } from 'ngx-toastr';



//Import Angular Material
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatBadgeModule} from '@angular/material/badge';
import { MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { MatButtonModule} from '@angular/material/button';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatCardModule} from '@angular/material/card';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatChipsModule} from '@angular/material/chips';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatDialogModule} from '@angular/material/dialog';
import { MatDividerModule} from '@angular/material/divider';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatIconModule} from '@angular/material/icon';
import { MatInputModule} from '@angular/material/input';
import { MatListModule} from '@angular/material/list';
import { MatMenuModule} from '@angular/material/menu';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatRadioModule} from '@angular/material/radio';
import { MatRippleModule} from '@angular/material/core';
import { MatSelectModule} from '@angular/material/select';
//import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSliderModule} from '@angular/material/slider';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSortModule} from '@angular/material/sort';
import { MatStepperModule} from '@angular/material/stepper';
import { MatTableModule} from '@angular/material/table';
import { MatTabsModule} from '@angular/material/tabs';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatTreeModule} from '@angular/material/tree';
import { DialogModule } from '@angular/cdk/dialog';

import { CommonModule, NgFor } from '@angular/common';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ThaidatePipe } from './pipes/dateformat/thaidate.pipe';


//export
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatOptionModule, MatNativeDateModule , DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { FileSaverModule } from 'ngx-filesaver';

//view
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { MeetingviewlistComponent } from './views/meeting/meetingviewlist/meetingviewlist.component';
import { MeetingInsertdialogComponent } from './views/meeting/meeting-insertdialog/meeting-insertdialog.component';
import { MeetingDeletedialogComponent } from './views/meeting/meeting-deletedialog/meeting-deletedialog.component';
import { CounselorviewlistComponent } from './views/counselor/counselorviewlist/counselorviewlist.component';
import { CounselorInsertdialogComponent } from './views/counselor/counselor-insertdialog/counselor-insertdialog.component';
import { CounselorDeletedialogComponent } from './views/counselor/counselor-deletedialog/counselor-deletedialog.component';
import { ConsulationviewlistComponent } from './views/consulation/consulationviewlist/consulationviewlist.component';
import { ConsulationInsertdialogComponent } from './views/consulation/consulation-insertdialog/consulation-insertdialog.component';
import { ConsulationDeletedialogComponent } from './views/consulation/consulation-deletedialog/consulation-deletedialog.component';
import { ResponselistComponent } from './views/response/responselist/responselist.component';
import { ResponseInsertdialogComponent } from './views/response/response-insertdialog/response-insertdialog.component';
import { ResponseDeletedialogComponent } from './views/response/response-deletedialog/response-deletedialog.component';
import { HeaderComponent } from './views/header/header.component';
import { ConsulationviewdetailComponent } from './views/consulation/consulationviewdetail/consulationviewdetail.component';
import { ConsulationministryInsertdialogComponent } from './views/consulation/consulationministry/consulationministry-insertdialog/consulationministry-insertdialog.component';
import { ConsulationministryDeletedialogComponent } from './views/consulation/consulationministry/consulationministry-deletedialog/consulationministry-deletedialog.component';
import { ConsulationprovinceInsertdialogComponent } from './views/consulation/consulationprovince/consulationprovince-insertdialog/consulationprovince-insertdialog.component';
import { ConsulationprovinceDeletedialogComponent } from './views/consulation/consulationprovince/consulationprovince-deletedialog/consulationprovince-deletedialog.component';
import { AttachInsertdialogComponent } from './views/consulation/attach/attach-insertdialog/attach-insertdialog.component';
import { AttachDeletedialogComponent } from './views/consulation/attach/attach-deletedialog/attach-deletedialog.component';
import { ResponsedetailComponent } from './views/response/responsedetail/responsedetail.component';
import { AttachresInsertdialogComponent } from './views/response/attachres/attachres-insertdialog/attachres-insertdialog.component';
import { AttachresDeletedialogComponent } from './views/response/attachres/attachres-deletedialog/attachres-deletedialog.component';
import { MenuItemComponent } from './views/menu/menu-item/menu-item.component';
import { MenuListItemComponent } from './views/menu/menu-list-item/menu-list-item.component';
import { LoadingComponent } from './loading/loading.component';
import { MpconsultationviewlistComponent } from './views/mp/mpconsultationviewlist/mpconsultationviewlist.component';
import { MpconsultationviewdetailComponent } from './views/mp/mpconsultationviewdetail/mpconsultationviewdetail.component';
import { MpresponseviewlistComponent } from './views/mp/mpresponseviewlist/mpresponseviewlist.component';
import { MpresponseviewdetailComponent } from './views/mp/mpresponseviewdetail/mpresponseviewdetail.component';
import { GaconsultationviewlistComponent } from './views/ga/gaconsultationviewlist/gaconsultationviewlist.component';
import { GaconsultationviewdetailComponent } from './views/ga/gaconsultationviewdetail/gaconsultationviewdetail.component';
import { GaresponseviewlistComponent } from './views/ga/garesponseviewlist/garesponseviewlist.component';
import { GaresponseviewdetailComponent } from './views/ga/garesponseviewdetail/garesponseviewdetail.component';
import { PpsearchComponent } from './views/pp/ppsearch/ppsearch.component';
import { PpsearchdetailComponent } from './views/pp/ppsearchdetail/ppsearchdetail.component';
import { PpresponseComponent } from './views/pp/ppresponse/ppresponse.component';
import { PpresponsedetailComponent } from './views/pp/ppresponsedetail/ppresponsedetail.component';
import { UserviewlistComponent } from './views/adm/user/userviewlist/userviewlist.component';
import { UserInsertdialogComponent } from './views/adm/user/user-insertdialog/user-insertdialog.component';
import { MeetingDownloaddialogComponent } from './views/meeting/meeting-downloaddialog/meeting-downloaddialog.component';
import { ApprovedviewlistComponent } from './views/approve/approvedviewlist/approvedviewlist.component';
import { ApprovedPublicdialogComponent } from './views/approve/approved-publicdialog/approved-publicdialog.component';
import { ApprovedApprovedialogComponent } from './views/approve/approved-approvedialog/approved-approvedialog.component';
import { ApprovedEditdialogComponent } from './views/approve/approved-editdialog/approved-editdialog.component';
import { CostcenterviewlistComponent } from './views/adm/costcenter/costcenterviewlist/costcenterviewlist.component';
import { CostcenterInsertdialogComponent } from './views/adm/costcenter/costcenter-insertdialog/costcenter-insertdialog.component';
import { PartylistviewlistComponent } from './views/adm/partylist/partylistviewlist/partylistviewlist.component';
import { PartylistInsertdialogComponent } from './views/adm/partylist/partylist-insertdialog/partylist-insertdialog.component';
import { MinistryviewlistComponent } from './views/adm/ministry/ministryviewlist/ministryviewlist.component';
import { MinistryInsertdialogComponent } from './views/adm/ministry/ministry-insertdialog/ministry-insertdialog.component';
import { MemberviewlistComponent } from './views/adm/member/memberviewlist/memberviewlist.component';
import { CounselorsviewlistComponent } from './views/adm/member/counselorsviewlist/counselorsviewlist.component';
import { ReportInsertdialogComponent } from './views/pp/report/report-insertdialog/report-insertdialog.component';
import { ReportDeletedialogComponent } from './views/pp/report/report-deletedialog/report-deletedialog.component';
import { ReportDownloaddialogComponent } from './views/pp/report/report-downloaddialog/report-downloaddialog.component';
import { ReportviewlistComponent } from './views/pp/report/reportviewlist/reportviewlist.component';
import { PpsearchdetailsComponent } from './views/pp/ppsearchdetails/ppsearchdetails.component';


export class AppDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
      date.setUTCHours(date.getUTCHours() + 7, 0, 0);
      if (displayFormat == "input") {
          let day = date.getDate();
          let month = date.getMonth() + 1;
          let year;
          if (date.getFullYear() < 2500)
              year = date.getFullYear() + 543;
          else
              year = date.getFullYear();
          return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
      } else {
          let day = date.getMonth() + 1;
          let month = date.getDate();
          let year;
          if (date.getFullYear() < 2500)
              year = date.getFullYear() + 543;
          else
              year = date.getFullYear();

          return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
      }
  }

  private _to2digit(n: number) {
      return ('00' + n).slice(-2);
  }
}

export const APP_DATE_FORMATS = {
  parse: {
      dateInput: 'DD/MM/YYYY',
  },
  display: {
      dateInput: 'input',
      monthYearLabel: 'input',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'DD/MMM/YYYY',
  },
};

@NgModule({
  declarations: [
    ThaidatePipe,
    AppComponent,
    LoginComponent,
    HomeComponent,
    MeetingviewlistComponent,
    MeetingInsertdialogComponent,
    MeetingDeletedialogComponent,
    CounselorviewlistComponent,
    CounselorInsertdialogComponent,
    CounselorDeletedialogComponent,
    ConsulationviewlistComponent,
    ConsulationInsertdialogComponent,
    ConsulationDeletedialogComponent,
    ResponselistComponent,
    ResponseInsertdialogComponent,
    ResponseDeletedialogComponent,
    HeaderComponent,
    ConsulationviewdetailComponent,
    ConsulationministryInsertdialogComponent,
    ConsulationministryDeletedialogComponent,
    ConsulationprovinceInsertdialogComponent,
    ConsulationprovinceDeletedialogComponent,
    AttachInsertdialogComponent,
    AttachDeletedialogComponent,
    ResponsedetailComponent,
    AttachresInsertdialogComponent,
    AttachresDeletedialogComponent,
    MenuItemComponent,
    MenuListItemComponent,
    LoadingComponent,
    MpconsultationviewlistComponent,
    MpconsultationviewdetailComponent,
    MpresponseviewlistComponent,
    MpresponseviewdetailComponent,
    GaconsultationviewlistComponent,
    GaconsultationviewdetailComponent,
    GaresponseviewlistComponent,
    GaresponseviewdetailComponent,
    PpsearchComponent,
    PpsearchdetailComponent,
    PpresponseComponent,
    PpresponsedetailComponent,
    UserviewlistComponent,
    UserInsertdialogComponent,
    MeetingDownloaddialogComponent,
    ApprovedviewlistComponent,
    ApprovedPublicdialogComponent,
    ApprovedApprovedialogComponent,
    ApprovedEditdialogComponent,
    CostcenterviewlistComponent,
    CostcenterInsertdialogComponent,
    PartylistviewlistComponent,
    PartylistInsertdialogComponent,
    MinistryviewlistComponent,
    MinistryInsertdialogComponent,
    MemberviewlistComponent,
    CounselorsviewlistComponent,
    ReportInsertdialogComponent,
    ReportDeletedialogComponent,
    ReportDownloaddialogComponent,
    ReportviewlistComponent,
    PpsearchdetailsComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    ToastrModule.forRoot(),

    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    //MatSelectFilterModule,
    NgxMatSelectSearchModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    DialogModule,
    NgFor,
    FormsModule,
    BrowserAnimationsModule,
    FileSaverModule,
    ReactiveFormsModule,


  ],
  exports: [
        BrowserAnimationsModule,
        MatToolbarModule,
        MatInputModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatDividerModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatRadioModule,
        MatOptionModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatSidenavModule,
        MatListModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatDialogModule,
        MatSortModule,
        MatCheckboxModule,
        MatTabsModule,
        FileSaverModule,
        MatProgressBarModule,
        MatAutocompleteModule,
        ReactiveFormsModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'th-TH' },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: DatePipe },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    DatePipe, 
    MatDatepickerModule,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
