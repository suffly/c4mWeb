import { Component, ViewChild, ElementRef, HostListener, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Userprofile } from '@app/models/userprofile';
import { AuthService } from '@app/services/authen/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private authenService: AuthService,
    private router: Router,
    private datePipe: DatePipe,
    public _location: Location,
    public dialogService: MatDialog,
  ) {
    this.authenService.currentUser.subscribe(x => this.currentUser = x);
    this.datePipe.transform(this.nowDate, 'yyyy-MM-dd');
    this.returnUrl = 'home';
  }

  @Output() public sidenavToggle = new EventEmitter();
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChild(ElementRef) appDrawer: ElementRef;
  public href: string = "";
  opened = true;
  nowDate = new Date();
  loading = false;
  returnUrl: string;
  user: Userprofile;
  currentUser: Userprofile;
  checked: boolean;
  private readonly CURRENT_USER = 'currentUser';

  ngOnInit(): void {
    
    this.href = window.location.pathname;// this.router.url;
    if (window.innerWidth < 768) {
      //this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      //this.sidenav.fixedTopGap = 55;
      this.opened = true;
    }
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}');
    this.loaddata();
    
  }

  loaddata() {
    this.returnUrl = 'meeting'   
    this.router.navigate([this.returnUrl]);
  }

  

  getCurrentDate() {
    setInterval(() => {
      this.nowDate = new Date(); //set time variable with current date 
    }, 1000); // set it every one seconds}
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  logOut() {
    this.authenService.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) { //: { target: { innerWidth: number; }; }
    if (event.target.innerWidth < 768) {
      //this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      //this.sidenav.fixedTopGap = 55
      this.opened = true;
    }
  }

  isBiggerScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 768) {
      return true;
    } else {
      return false;
    }
  }

}
