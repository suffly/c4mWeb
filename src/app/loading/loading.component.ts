import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: ` <div id="pause" class="d-flex align-items-center justify-content-center">
                <div id="spinner"></div>
              </div>`,
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
