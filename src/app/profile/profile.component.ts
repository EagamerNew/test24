import { Component, OnInit } from '@angular/core';
import {User} from "../shared/model/user";
import {CookieService} from "ngx-cookie-service";
import {CommonService} from "../shared/common.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user:any;
  gender = [{code:'male',name:"мужской"},
            {code:'female',name:"женский"}];

  cities = [{code:'almaty',name:"Алматы"},
    {code:'taraz',name:"Тараз"}];

  docUserId: string;

  constructor(private cookieService: CookieService,
              private commonService: CommonService) { }

  ngOnInit() {
    if(this.docUserId = this.cookieService.get('userId')){
      this.getUserByDocId();
    }
  }

  getUserByDocId(){
    this.commonService.getUserByDocId(this.docUserId).then(res=>{
      console.log('res: ', res);
      this.user = res[0];
    })
  }

}
