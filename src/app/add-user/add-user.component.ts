import { Component, OnInit } from '@angular/core';
import {User} from "../shared/model/user";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  user:User = new User();
  gender = [{code:'male',name:"мужской"},
            {code:'female',name:"женский"}];

  cities = [{code:'almaty',name:"Алматы"},
    {code:'taraz',name:"Тараз"}];
  constructor() { }

  ngOnInit() {
  }

}
