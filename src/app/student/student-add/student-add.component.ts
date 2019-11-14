import {Component, OnInit} from '@angular/core';
import {CITIES, GENDER, USER_STATUS} from '../../shared/default-constant';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {CommonService} from '../../shared/common.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.css']
})
export class StudentAddComponent implements OnInit {
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
    privilegeList: [],
    companyIds: []
  };
  gender = GENDER;
  statusList = USER_STATUS;
  cities = CITIES;
  companyId = '';
  isSearchingByIdn = true;
  isUserExist = false;

  constructor(private router: ActivatedRoute,
              public snackBar: MatSnackBar,
              private commonService: CommonService,
              private cookieService: CookieService) {
  }

  ngOnInit(): void {
    this.cookieService.set('title', 'Добавление студента');
  }


  searchStudentByIdn() {
    this.commonService.getUserByUserIdn(this.user.idn).then(res => {
      if (res && res.length > 0) {
        this.user = res[0];
        console.log(res);
        console.log(res[0]);
        this.isSearchingByIdn = false;
        this.isUserExist = true;
      } else {
        this.isSearchingByIdn = false;
        this.isUserExist = false;
      }
    });
  }

  saveStudent() {
    this.addCompanyId(this.user);
    console.log(this.user);
    if (this.isUserExist) {
      this.commonService.updateUserByDocIdWithoutPassword(this.user.id, this.user).then(res => {
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
          privilegeList: [],
          companyIds: []
        };
        this.openSnackBar('Пользователь успешно обновлен', '');
        this.back();
      });
    } else {
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
          privilegeList: [],
          companyIds: []
        };
        this.openSnackBar('Пользователь создан', '');
        this.back();
      });
    }
  }

  back() {
    this.user = {};
    this.isSearchingByIdn = true;
    this.isUserExist = false;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  addCompanyId(user: any) {
    if (user.companyIds === null || user.companyIds === undefined) {
      user.companyIds = [];
    }
    if (this.cookieService.get('companyId')) {
      this.companyId = this.cookieService.get('companyId');
      if (user.companyIds.indexOf(this.companyId) !== -1) {
        this.openSnackBar('Студент уже существует!', '');
      } else {
        user.companyIds.push(this.companyId);
      }
    } else {
      this.openSnackBar('Вы не состоите в компании!', '');
    }
  }
}
