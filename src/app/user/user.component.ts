import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material";
import {CommonService} from "../shared/common.service";
import {CookieService} from "ngx-cookie-service";
import {CITIES, GENDER, USER_PRIVILEGES, USER_ROLE_LIST, USER_STATUS} from "../shared/default-constant";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userList: any;
  cityList = CITIES;
  genderList = GENDER;
  statusList = USER_STATUS;
  roleList = USER_ROLE_LIST;
  privilegeList = USER_PRIVILEGES;
  privilegeTitle = 'Select all';
  privilegeOption = 'all';

  constructor(public snackBar: MatSnackBar,
              public commonService: CommonService,
              private cookie: CookieService) {
  }

  ngOnInit(): void {
    this.getUserList();
  }

  selectAll(userId) {


    if (this.privilegeOption === 'all') {
      this.privilegeTitle = 'Сбросить';
      this.privilegeOption = 'deall';

    } else {
      this.privilegeTitle = 'Выбрать все';
      this.privilegeOption = 'all';
    }

    for (let i = 0; i < this.userList.length; i++) {
      if (this.userList[i].id === userId) {
        if (this.privilegeOption === 'all') {
          this.userList[i].privilegeList = [];
          this.privilegeList.forEach(value => this.userList[i].privilegeList.push(value.code));
        } else {
          this.userList[i].privilegeList = [];
        }
      }
    }
  }

  getUserList(): void {
    this.commonService.getUserList().then(res => {
      this.userList = res;
    })
  }

  updateUserByUserDocId(user: any): void {

    let trust = false;

    for (let i = 0; i < user.privilegeList.length; i++) {
      if(user.privilegeList[i] === 'examination'){
        trust = true;
      }
      if(user.privilegeList[i] === 'question'){
        trust = false;
      }
    }
    if(trust){
      user.privilegeList.push('question');
    }
    // to remove duplicated elements
    user.privilegeList = user.privilegeList.filter((el,i,a) => i === a.indexOf(el));
    if(!user.password){
      user.password = '';
    }
    this.commonService.updateUserByDocId(user.id, user).then(res => {
      this.openSnackBar('Пользователь успешно обновлен', '');
      this.getUserList();
    });
  }

  deleteUserByUserDocId(userDocId): void {
    this.commonService.deleteUserByUserDocId(userDocId).then(res => {
      this.openSnackBar('Пользователь успешно удален', '');
      this.getUserList();
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
