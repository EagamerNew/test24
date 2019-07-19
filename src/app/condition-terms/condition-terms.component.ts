import { Component, OnInit } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {CommonService} from "../shared/common.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-condition-terms',
  templateUrl: './condition-terms.component.html',
  styleUrls: ['./condition-terms.component.css']
})
export class ConditionTermsComponent implements OnInit {

  userRole = "user";
  condition = "";
  conditionId = "";
  constructor(private cookieService: CookieService,
              private commonService: CommonService,
              private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.cookieService.set('title', 'Условия');
    this.userRole = this.cookieService.get('role');
    this.commonService.getConditionTerms().then(res=>{
      this.condition = res[0].description;
      this.conditionId = res[0].id;
    })
  }

  saveCondition() {
    this.commonService.updateConditionTerms(this.conditionId,this.condition).then(res=>{
      this.matSnackBar.open('Условия обновлены!','',{
        duration: 1500
      })
    })
  }
}
