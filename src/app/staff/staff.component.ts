import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {CommonService} from '../shared/common.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  companyList: any [] = [];
  subsidiaryList: any [] = [];
  companyId: string = '';
  role: string = '';
  tempVal: any = {
    company: {},
    userIdn: '',
    subsidiary: ''
  };

  constructor(public snackBar: MatSnackBar,
              private commonService: CommonService,
              private cookieService: CookieService,) {
  }

  ngOnInit() {
    this.cookieService.set('title', 'Сотрудники');
    this.companyId = this.cookieService.get('companyId');
    this.role = this.cookieService.get('role');

    if (this.companyId) {
      this.tempVal.company = this.companyId;
      this.getSubsidiaryList(this.companyId);
    } else {
      this.openSnackBar('Вы не пренадлежите к какой-либо компании. Функция не доступна.', '');
    }
    console.log((this.companyId && this.role !== 'admin'));
    this.getCompanyList();
  }


  getSubsidiaryList(companyId: string) {
    console.log('-------------', this.tempVal.company);

    this.commonService.getSubsidiaryListByCompanyId(companyId).then(res => {
      console.log('subsidiarylist:', res);
      this.subsidiaryList = res.map(result => {
        return {
          id: result.id,
          cityCode: result.cityCode,
          address: result.address,
          name: result.name
        };
      });
    });
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getCompanyList() {
    this.commonService.getActiveCompanyList().then(res => {
      this.companyList = res;
      if (this.companyId && this.role !== 'admin') {
        for (let i = 0; i < res.length; i++) {
          if (res[i].id === this.companyId) {
            this.companyList = [res[i]];
            break;
          }
        }
      }
      console.log('companyList:', this.companyList);
    });
  }

  add() {
    this.commonService.getUserByIdn(this.tempVal.userIdn).then(res => {
      if (res && res.length > 0) {
        let user = res[0];
        if (user.companyId) {
          this.openSnackBar('Пользователь уже состоит в компании', '');
        } else {
          this.commonService.setCompanyIdForUser(user.id, this.tempVal.company.id, this.tempVal.subsidiary).then(res => {
            this.openSnackBar('Пользователь добавлен в компанию', '');
            this.tempVal.userIdn = '';
          });
        }
      } else {
        this.openSnackBar('Пользователь не найден', '');
      }
    });
  }
}
