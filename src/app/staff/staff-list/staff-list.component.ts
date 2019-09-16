import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../shared/common.service';
import {CookieService} from 'ngx-cookie-service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {

  companyId: string;
  userId: string;
  activeId: string;
  role: string;
  searchText = '';
  staffList: any[] = [];

  companyList: any[] = [];
  subsidiaryList: any[] = [];
  cityList: any[] = [];
  allStaffList: any[];

  constructor(
    private commonService: CommonService,
    private cookieService: CookieService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.cookieService.set('title', 'Сотрудники');
    this.userId = this.cookieService.get('userId');
    this.companyId = this.cookieService.get('companyId');
    this.role = this.cookieService.get('role');

    console.log(this.companyId);
    console.log(this.userId);
    console.log(this.role);

    if (!this.companyId && this.role !== 'admin') {
      this.showMessage('Вы не пренадлежите к какой-либо компании. Список не доступен.');
    } else {
      this.loadList();
    }
  }

  async loadList() {
    this.companyList = await this.commonService.getCompanyList();
    this.subsidiaryList = await this.commonService.getSubsidiaryList();
    this.cityList = await this.commonService.getCityList();
    let resolvedList = await this.commonService.getCompanyStaffMembers(this.companyId, this.role);
    resolvedList.subscribe(res=>{
      this.staffList = res.map(sub => {
        const staff = {
          id: sub.payload.doc.id,
          companyName: this.getCompanyNameById(sub.payload.doc.data()['companyId']),
          subsidiaryAddress: this.getSubsidiaryAddressById(sub.payload.doc.data()['subsidiaryId']),
          subsidiaryName: this.getSubsidiaryNameById(sub.payload.doc.data()['subsidiaryId']),
          ...sub.payload.doc.data()

        };
        return staff;
      });
      this.allStaffList = this.staffList;
    });
  }

  getCityNameByCode(code: string): string {
    for (let i = 0; i < this.cityList.length; i++) {
      if (this.cityList[i].code === code) {
        return this.cityList[i].name;
      }
    }
    return '';
  }

  getCompanyNameById(id: string): string {
    for (let i = 0; i < this.companyList.length; i++) {
      if (this.companyList[i].id === id) {
        return this.companyList[i].name;
      }
    }
    return '';
  }

  getSubsidiaryNameById(id: string): string {
    for (let i = 0; i < this.subsidiaryList.length; i++) {
      if (this.subsidiaryList[i].id === id) {
        return this.subsidiaryList[i].name;
      }
    }
    return '-';
  }

  getSubsidiaryAddressById(id: string): string {
    let subsidiary;
    for (let i = 0; i < this.subsidiaryList.length; i++) {
      if (this.subsidiaryList[i].id === id) {
        subsidiary = this.subsidiaryList[i];
        break;
      }
    }
    if (subsidiary) {
      return this.getCityNameByCode(subsidiary.cityCode) + ', ' + subsidiary.address;
    }
    return '-';
  }

  search(): void {
    if (this.searchText === '' || this.searchText === null || this.searchText.length === 0) {
      this.staffList = this.allStaffList;
    } else {
      console.log(this.searchText);
      this.staffList = [];
      this.allStaffList.forEach(value => {
        if (value.companyName.toLowerCase().includes(this.searchText.toLowerCase())
          || value.lastname.toLowerCase().includes(this.searchText.toLowerCase())
          || value.firstname.toLowerCase().includes(this.searchText.toLowerCase())
        ) {
          this.staffList.push(value);
        }
      });
    }
  }

  showMessage(message: string): void {
    this.snackBar.open(message, '', {duration: 1500});
  }

  getRuRoleName(role: string): string {
    switch (role) {
      case 'user':
        return 'Пользователь';
      case 'staff':
        return 'Сотрудник';
    }
  }

  activate(managerId: string, userId: string): void {
    this.activeId = userId;
    if(this.userId === managerId || this.role === 'admin'){
      this.router.navigateByUrl('/profile/' + userId);
    }else{
      this.showMessage('Ошибка. Вы не менеджер данного сотрудника. Информация не доступна');
    }
  }
}
