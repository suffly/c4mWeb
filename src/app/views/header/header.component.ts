import { Component, ViewChild, ElementRef, HostListener, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Userprofile } from '@app/models/userprofile';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    public _location: Location,
    public dialogService: MatDialog,
  ) {}

  @Output() public sidenavToggle = new EventEmitter();
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  public href: string = "";
  opened = true;
  nowDate = new Date();
  loading = false;
  returnUrl: string;
  public currentUser: Userprofile;
  

  ngOnInit(): void {
    
    this.href = window.location.pathname;// this.router.url;
    if (window.innerWidth < 768) {
      //this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      //this.sidenav.fixedTopGap = 55;
      this.opened = true;
    }
    
    this.loaddata();
    
  }

  loaddata() {
    //this.currentUser.user_id = 1;
    this.returnUrl = 'meeting'   
    this.router.navigate([this.returnUrl]);
  }


  logOut() {
    //this.authenService.logout();
    this.router.navigate(['/login']);
  }

}
