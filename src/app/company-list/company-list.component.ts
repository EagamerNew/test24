import { Component, OnInit } from '@angular/core';
import {CommonService} from '../shared/common.service';
import {Company} from '../new-company/new-company.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companyList:Company[] = [];
  constructor(private _service: CommonService,) { }

  ngOnInit() {
    this.getpositionList()
  }
  getpositionList(): void {
    this._service.getCompanyList().then(res => {
      console.log(res)
      this.companyList = res.map(result =>{
        return {
          id:result.id,
          bin: result.bin,
          phoneNumber: result.phoneNumber,
          name: result.name
        }
      });
    });

  }
}
