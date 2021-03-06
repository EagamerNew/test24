import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {User} from '../shared/model/user';
import {CommonService} from '../shared/common.service';
import {CITIES, GENDER, USER_PRIVILEGES_SHORT, USER_STATUS} from '../shared/default-constant';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  userId: string;
  user: any = {
    idn: '',
    lastname: '',
    firstname: '',
    gender: '',
    birthdate: new Date('1990-01-01T00:00:00'),
    phoneNumber: '',
    city: '',
    userId: '',
    status: 'created',
    role: 'user',
    privilegeList: []
  };
  gender = GENDER;
  statusList = USER_STATUS;
  cities = CITIES;

  constructor(private router: ActivatedRoute,
              public snackBar: MatSnackBar,
              private commonService: CommonService,
              private cookieService: CookieService) {
  }

  ngOnInit() {

    this.cookieService.set('title', 'Регистрация');
  }

  save() {
    this.commonService.checkUserByPhone(this.user.phoneNumber).then(res => {
      console.log(res);
      console.log('phoneNumber: ', this.user.phoneNumber);
      console.log('length: ', res.length);
      if (res.length === 0) {
        this.user.privilegeList.push(USER_PRIVILEGES_SHORT.EXAM_LIST.toString());
        this.commonService.saveUser(this.user).then(res => {
          this.user = {
            idn: '',
            lastname: '',
            firstname: '',
            gender: '',
            birthdate: new Date(),
            phoneNumber: '',
            city: '',
            userId: '',
            status: 'created',
            role: 'user',
            privilegeList: []
          };
          this.openSnackBar('Пользователь создан', '');
        });
      } else {
        this.openSnackBar('Пользователь с таким номером уже зарегестрирован', '');
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
