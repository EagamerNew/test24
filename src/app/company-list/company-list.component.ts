import {Component, OnInit} from '@angular/core';
import {CommonService} from '../shared/common.service';
import {Company} from '../new-company/new-company.component';
import {Subsidiary} from '../subsidiary/subsidiary.component';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companyList: Company[] = [];
  loading: boolean = true;

  constructor(private _service: CommonService,
              private cookieService: CookieService) {
  }

  ngOnInit() {
    this.cookieService.set('title', 'Компании');
    this.getpositionList();
  }

  getpositionList(): void {
    this.loading = true;
    this._service.getCompanyList().then(res => {
      console.log(res);
      this.companyList = res.map(result => {
        return {
          id: result.id,
          bin: result.bin,
          phoneNumber: result.phoneNumber,
          subsidiary: result.subsidiary,
          name: result.name,
          status: result.status
        };
      });
      this.loading = false;
    });
  }
}
