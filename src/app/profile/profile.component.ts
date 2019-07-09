import {Component, OnInit} from '@angular/core';
import {User} from "../shared/model/user";
import {CookieService} from "ngx-cookie-service";
import {CommonService} from "../shared/common.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  gender = [{code: 'male', name: "мужской"},
    {code: 'female', name: "женский"}];

  cities = [{code: 'almaty', name: "Алматы"},
    {code: 'taraz', name: "Тараз"}];

  docUserId: string;
  newPassword;

  examHistory: any[]= [];
  constructor(private cookieService: CookieService,
              private commonService: CommonService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.cookieService.set('title', 'Мой профиль');
    if (this.docUserId = this.cookieService.get('userId')) {
      this.getUserByDocId();
      this.getExamHistory();
    }
  }

  getExamHistory(){
    this.commonService.getExamHistoryByUserId(this.docUserId).then(res=>{
      this.examHistory = res.map(mapper => {
        if (mapper.date) {
          const date = mapper.date.split('-');
          mapper['realDate'] = date[0] + ' ' + this.monthInRus(parseInt(date[1])) + ' ' + date[2];
        }
        return mapper;
      });
    })
  }

  calculatePercent(correct, mistake) {
    const all: number = parseInt(correct) + parseInt(mistake);
    return ((correct * 100) / (all)).toFixed();
  }

  calculateRealDate(dateIn){
    const date = dateIn.split('-');
    return date[0] + ' ' + this.monthInRus(parseInt(date[1])) + ' ' + date[2];
  }

  trackByFn(index, item) {
    return index;
  }

  monthInRus(month: number) {
    switch (month) {
      case 1:
        return 'янв';
        break;
      case 2:
        return 'фев';
        break;
      case 3:
        return 'март';
        break;
      case 4:
        return 'апр';
        break;
      case 5:
        return 'май';
        break;
      case 6:
        return 'июнь';
        break;
      case 7:
        return 'июль';
        break;
      case 8:
        return 'авг';
        break;
      case 9:
        return 'сен';
        break;
      case 10:
        return 'окт';
        break;
      case 11:
        return 'ноя';
        break;
      case 12:
        return 'дек';
        break;
    }
  }

  getUserByDocId() {
    this.commonService.getUserByDocId(this.docUserId).then(res => {
      console.log('res: ', res);
      this.user = res[0];
    })
  }

  setNewPassword() {
    this.commonService.updateUserPassword(this.docUserId, this.newPassword).then(res => {
      this.newPassword = "";
      this.openSnackBar("Пароль успешно изменен");
    });
  }

  openSnackBar(message) {
    this.snackBar.open(message, "", {
      duration: 1000
    });
  }

}
