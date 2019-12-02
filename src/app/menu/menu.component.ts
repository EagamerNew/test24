import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {CommonService} from '../shared/common.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  userRole: string;
  userDocId: string;
  userPrivilegeList: any = [];
  isOperation: boolean = false;
  snackBarRef: any;

  constructor(public cookie: CookieService,
              private router: Router,
              private commonService: CommonService,
              private matSnackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.cookie.set('title', 'Меню');
    this.userDocId = this.cookie.get('userId');
    this.userRole = this.cookie.get('role');
    let firstly = this.cookie.get('firstly');

    if (this.userDocId) {
      this.getUserPrivilegeList();
    } else {
      let userRole = 'anonymous';
      this.cookie.set('role', userRole);
      this.userRole = userRole;
    }
    if (firstly && firstly === '1') {
    } else {
      this.cookie.set('firstly', '1');
      this.router.navigateByUrl('demo-list');
    }
  }

  getUserPrivilegeList() {
    this.commonService.getUserPrivilegeListByDocId(this.userDocId).then(res => {

      console.log('role: ' + this.userRole);
      if (res.length > 0) {
        console.log(res[0]);
        this.userPrivilegeList = res[0].privilegeList;
      }
    });
  }

  logout() {
    // firebase.auth().signOut().then(function() {
    // Sign-out successful.
    this.cookie.deleteAll();
    console.log('success logout');
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
          if (this.userPrivilegeList.includes('category')) {
            result = true;
          }
          break;
        case 'question-speciality':
          if (this.userPrivilegeList.includes('speciality')) {
            result = true;
          }
          break;
        case 'question-section':
          if (this.userPrivilegeList.includes('section')) {
            result = true;
          }
          break;
        case 'question-moderation':
          if (this.userPrivilegeList.includes('question-moderation')) {
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
          if (this.userRole === 'staff' || this.userRole === 'user' || this.userRole === 'anonymous' || this.userPrivilegeList.includes('question-template')) {
            result = true;
          }
          break;
        case 'exam-list':
          if (this.userRole === 'user' || this.userRole === 'anonymous' || this.userRole === 'staff' || this.userRole === 'author' || this.userPrivilegeList.includes('exam-list')) {
            result = true;
          }
          break;
        case 'registration':
          if (this.userRole === 'staff' || this.userPrivilegeList.includes('users')) {
            result = true;
          }
          break;
        case 'exam':
          if (this.userRole === 'staff' && this.cookie.check('companyId')) {
            result = true;
          }
          break;
        case 'staff':
          if (this.userRole === 'staff' && this.cookie.check('companyId')) {
            result = true;
          }
          break;
        case 'users':
          if (this.userRole === 'staff' && this.cookie.check('companyId')) {
            result = true;
          }
          break;
        case 'subsidiary':
          if (this.userRole === 'staff' && this.cookie.check('companyId')) {
            result = true;
          }
          break;
        case 'staff-list':
          if (this.userRole === 'staff' && this.cookie.check('companyId')) {
            result = true;
          }
          break;
        case 'student-add':
          if (this.userRole === 'staff' && this.cookie.check('companyId')) {
            result = true;
          }
          break;
        case 'company-student':
          if(this.userRole === 'staff' && this.cookie.check('companyId')){
            result = true;
          }
      }
    }

    return result;
  }


  showOperations() {
    this.isOperation = true;
  }

  hideOperations() {
    this.isOperation = false;
  }


}
