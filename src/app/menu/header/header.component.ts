import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  routerLink: string = 'demo-list';

  constructor(private router: Router,
              public cookieService: CookieService) { }

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
