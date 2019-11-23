import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {CommonService} from '../shared/common.service';
import {CookieService} from 'ngx-cookie-service';
import {CITIES, GENDER, USER_PRIVILEGES, USER_ROLE_LIST, USER_STATUS} from '../shared/default-constant';

@Component({
  selector: 'student-list-company',
  templateUrl: './student-list-company.component.html',
  styleUrls: ['./student-list-company.component.css']
})
export class StudentListCompanyComponent implements OnInit {

  userList: any[] = [];
  allUserList: any[] = [];
  cityList = CITIES;
  genderList = GENDER;
  statusList = USER_STATUS;
  roleList = USER_ROLE_LIST;
  privilegeList = USER_PRIVILEGES;
  privilegeTitle = 'Select all';
  privilegeOption = 'all';
  searchText = '';

  constructor(public snackBar: MatSnackBar,
              public commonService: CommonService,
              private cookie: CookieService) {
  }

  ngOnInit(): void {
    this.cookie.set('title', 'Мои студенты');
    this.getUserList();
  }

  getUserList(): void {
    let list = [];
    this.commonService.getUserByDocId(this.cookie.get('userId')).then(ress => {
      // this.commonService.getUserStudents(ress[0].companyId).then(res => {
      this.commonService.getUserList().then(res => {
        // res.map(mapper => {
        //   console.log();
        //   if (mapper && mapper.companyIds && mapper.companyIds.indexOf(ress[0].companyId)) {
        //     this.userList.push(res);
        //     this.allUserList.push(res);
        //   }
        // });
        for (let i = 0; i < res.length; i++) {
          if (res[i] && res[i].companyIds && res[i].companyIds.indexOf(ress[0].companyId)) {
            list.push(res[i]);
            console.log(res[i])
          }
        }
        this.userList = list;
        this.allUserList = list;

      });
    });
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  search(): void {
    if (this.searchText === '' || this.searchText === null || this.searchText.length === 0) {
      this.userList = this.allUserList;
    } else {
      this.userList = [];
      this.allUserList.forEach(value => {
        if (value.idn.toLowerCase().includes(this.searchText.toLowerCase())
          || value.lastname.toLowerCase().includes(this.searchText.toLowerCase())
          || value.firstname.toLowerCase().includes(this.searchText.toLowerCase())
        ) {
          this.userList.push(value);
        }
      });
    }
  }

  roleChanged(user: any) {
    if (user.role === 'user') {
      for (let i = 0; i < this.userList.length; i++) {
        if (user.id === this.userList[i].id) {
          this.userList[i].privilegeList = [];
          this.userList[i].companyId = '';
          break;
        }
      }
    }
  }
}
