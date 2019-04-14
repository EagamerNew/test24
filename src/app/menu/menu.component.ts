import {Component, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import * as firebase from "firebase";
import {Router} from "@angular/router";
import {CommonService} from "../shared/common.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  userRole: string;
  userDocId: string;
  userPrivilegeList: any = [];
  privilegeLoaded = false;

  constructor(public cookie: CookieService,
              private router: Router,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.userDocId = this.cookie.get('userId');
    this.userRole = this.cookie.get('role');
    if (this.userDocId) {
      this.getUserPrivilegeList();
    } else {
      let userRole = "anonymous";
      this.cookie.set('role', userRole);
      this.userRole = userRole;
    }
  }

  getUserPrivilegeList() {
    this.commonService.getUserPrivilegeListByDocId(this.userDocId).then(res => {

      console.log('role: ' + this.userRole);
      if (res.length > 0) {
        console.log(res[0]);
        this.userPrivilegeList = res[0].privilegeList;
      }
    })
  }

  logout() {
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

  checkToAccess(item): boolean {
    let result = false;

    if (this.userRole === 'admin') {
      result = true;
    } else {
      switch (item) {
        case 'question':
          if (this.userRole === 'staff' || this.userRole === 'author' || this.userPrivilegeList.includes('question')) {
            result = true;
          }
          break;
        case 'question-category':
          if (this.userRole === 'staff' || this.userPrivilegeList.includes('category')) {
            result = true;
          }
          break;
        case 'question-section':
          if (this.userRole === 'staff' || this.userPrivilegeList.includes('section')) {
            result = true;
          }
          break;
        case 'question-moderation':
          if (this.userRole === 'staff' || this.userPrivilegeList.includes('question-moderation')) {
            result = true;
          }
          break;
        case 'questions-list-section':
          if (this.userRole === 'staff' || this.userRole === 'author' || this.userPrivilegeList.includes('question')) {
            result = true;
          }
          break;

        case 'demo':
          if (this.userRole === 'staff' || this.userPrivilegeList.includes('question-template')) {
            result = true;

          }
          break;
        case 'demo-list':
          if (this.userRole === 'staff' || this.userRole === 'anonymous' || this.userPrivilegeList.includes('question-template') ) {
            result = true;
          }
          break;
        case 'registration':
          if (this.userRole === 'staff' || this.userPrivilegeList.includes('users')) {
            result = true;
          }
          break;
      }
    }

    return result;
  }


}
