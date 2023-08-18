import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { MeetingviewlistComponent } from './views/meeting/meetingviewlist/meetingviewlist.component';
import { CounselorviewlistComponent } from './views/counselor/counselorviewlist/counselorviewlist.component';
import { ConsulationviewlistComponent } from './views/consulation/consulationviewlist/consulationviewlist.component';


const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'meeting', component:MeetingviewlistComponent},
  {path: 'counselor', component:CounselorviewlistComponent},
  {path: 'consulation', component:ConsulationviewlistComponent},
  //{path: '', redirectTo: 'meeting', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
