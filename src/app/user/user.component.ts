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

  constructor(public snackBar: MatSnackBar,
              public commonService: CommonService,
              private cookie: CookieService) {
  }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList(): void{
    this.commonService.getUserList().then(res=>{
      this.userList = res;
    })
  }

  updateUserByUserDocId(user:any):void{
    this.commonService.updateUserByDocId(user.id, user).then(res=>{
      this.openSnackBar('Пользователь успешно обновлен','');
      this.getUserList();
    });
  }

  deleteUserByUserDocId(userDocId):void{
    this.commonService.deleteUserByUserDocId(userDocId).then(res=>{
      this.openSnackBar('Пользователь успешно удален','');
      this.getUserList();
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
