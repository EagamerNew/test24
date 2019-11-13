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
    privilegeList: []
  };
  gender = GENDER;
  statusList = USER_STATUS;
  cities = CITIES;
  isSearchingByIdn = true;
  constructor(private router: ActivatedRoute,
              public snackBar: MatSnackBar,
              private commonService: CommonService,
              private cookieService: CookieService) {
  }

  ngOnInit(): void {
    this.cookieService.set('title', 'Добавление студента');
  }
  back() {
    this.user = {};
    this.isSearchingByIdn = true;
  }

  searchStudentByIdn() {
    this.commonService.getUserByUserIdn(this.user.idn).then(res => {
      if (res && res.length > 0) {
        this.user = res[0];
        console.log(res);
        console.log(res[0]);
        this.isSearchingByIdn = false;
      } else {
        this.isSearchingByIdn = false;
      }
    });
  }
}
