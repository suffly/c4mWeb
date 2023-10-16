import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { MeetingviewlistComponent } from './views/meeting/meetingviewlist/meetingviewlist.component';
import { CounselorviewlistComponent } from './views/counselor/counselorviewlist/counselorviewlist.component';
import { ConsulationviewlistComponent } from './views/consulation/consulationviewlist/consulationviewlist.component';
import { ConsulationviewdetailComponent } from './views/consulation/consulationviewdetail/consulationviewdetail.component';
import { ResponselistComponent } from './views/response/responselist/responselist.component';
import { ResponsedetailComponent } from './views/response/responsedetail/responsedetail.component';


const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'meeting', component:MeetingviewlistComponent},
  {path: 'counselor', component:CounselorviewlistComponent},
  {path: 'consulation', component:ConsulationviewlistComponent},
  {path: 'consulationdetail', component:ConsulationviewdetailComponent},
  {path: 'response', component:ResponselistComponent},
  {path: 'responsedetail', component:ResponsedetailComponent},

  //{path: '', redirectTo: 'home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
