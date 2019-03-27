import { Component, OnInit } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import * as firebase from "firebase";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(public cookie: CookieService,
              private router:Router) { }

  ngOnInit() {
  }

  logout(){
    // firebase.auth().signOut().then(function() {
      // Sign-out successful.
      this.cookie.deleteAll();
      console.log("success logout");
      this.router.navigateByUrl('');
    // }).catch(function(error) {
    //   console.log("error with logout")
    //   // An error happened.
    // });
  }

}
