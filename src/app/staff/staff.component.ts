import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material";
import {CommonService} from "../shared/common.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  constructor(public snackBar: MatSnackBar,
              private commonService: CommonService,
              private cookieService: CookieService,) {
  }

  companyList: any [] =[];
  subsidiaryList: any [] = [];

  tempVal: any = {
    company:{},
    userIdn: ""
  }
  ngOnInit() {
    this.getCompanyList();
  }


  getSubsidiaryList() {
    console.log('-------------', this.tempVal.company);

    this.commonService.getSubsidiaryListByCompanyId(this.tempVal.company.id).then(res => {
      console.log(res)
      this.subsidiaryList = res.map(result => {
        return {
          id: result.id,
          cityCode: result.cityCode,
          address: result.address,
          name: result.name
        }
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
    })
  }

  add() {
    this.commonService.getUserByIdn(this.tempVal.userIdn).then(res=>{
      if(res && res.length > 0){
        let user = res[0];
        if(user.companyId){
          this.openSnackBar('Пользователь уже состоит в компании', '');
        }else{
          this.commonService.setCompanyIdForUser(user.id, this.tempVal.company.id).then(res=>{
            this.openSnackBar('Пользователь добавлен в компанию', '');
            this.tempVal.userIdn = '';
          });
        }
      }else{
        this.openSnackBar('Пользователь не найден', '');
      }
    })
  }
}
