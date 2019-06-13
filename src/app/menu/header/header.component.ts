import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  routerLink: string = 'demo-list';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  changeRouter() {
    if(this.routerLink === ''){
      this.routerLink = 'demo-list';
    }else{
      this.routerLink = '';
    }
    this.router.navigateByUrl(this.routerLink);
  }
}
