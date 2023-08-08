import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
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

import { NgFor } from '@angular/common';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { ThaidatePipe } from './pipes/dateformat/thaidate.pipe';


//export
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { FileSaverModule } from 'ngx-filesaver';

//view
import { HomeComponent } from './views/home/home.component';
import { MenuComponent } from './views/menu/menu.component';
import { LoginComponent } from './views/login/login.component';
import { MeetingviewlistComponent } from './views/meeting/meetingviewlist/meetingviewlist.component';
import { MeetingInsertdialogComponent } from './views/meeting/meeting-insertdialog/meeting-insertdialog.component';
import { MeetingDeletedialogComponent } from './views/meeting/meeting-deletedialog/meeting-deletedialog.component';



@NgModule({
  declarations: [
    ThaidatePipe,
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    MeetingviewlistComponent,
    MeetingInsertdialogComponent,
    MeetingDeletedialogComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

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
    //for insert jwt service
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
