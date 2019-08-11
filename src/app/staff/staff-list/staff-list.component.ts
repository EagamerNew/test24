import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../shared/common.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private cookieService: CookieService
  ) {
  }

  companyId: string;
  userId: string;
  role: string;

  staffList: any[] = [];

  ngOnInit() {
    this.cookieService.set('title', 'Сотрудники');
    this.userId = this.cookieService.get('userId');
    this.companyId = this.cookieService.get('companyId');
    this.role = this.cookieService.get('role');

    console.log(this.companyId);
    console.log(this.userId);
    console.log(this.role);
    this.getCompanyStaffMembers();
  }

  getCompanyStaffMembers() {

  }

}
