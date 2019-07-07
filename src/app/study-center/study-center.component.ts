import { Component, OnInit } from '@angular/core';
import {Company} from "../new-company/new-company.component";
import {CommonService} from "../shared/common.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-study-center',
  templateUrl: './study-center.component.html',
  styleUrls: ['./study-center.component.css']
})
export class StudyCenterComponent implements OnInit {
  companyList: Company[] = [];
  loading: boolean = true;

  constructor(private _service: CommonService,
              private cookieService: CookieService) {
  }

  ngOnInit() {
    this.cookieService.set('title', 'Учебные центры');
    this.getpositionList();
  }

  getpositionList(): void {
    this.loading = true;
    this._service.getActiveCompanyList().then(res => {
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
