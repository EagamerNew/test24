import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material";
import {User} from "../shared/model/user";
import {CommonService} from "../shared/common.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  private userId: string;
  private user: any = {
    idn: "",
    lastname: "",
    firstname: "",
    gender: "",
    birthdate: new Date(),
    phoneNumber: "",
    city: "",
    userId: "",
    status:"created"
  };
  gender = [{code: 'male', name: "мужской"},
    {code: 'female', name: "женский"}];

  cities = [{code: 'almaty', name: "Алматы"},
    {code: 'taraz', name: "Тараз"}];

  constructor(private router: ActivatedRoute,
              public snackBar: MatSnackBar,
              private commonService: CommonService) {
  }

  ngOnInit() {
    // this.router.params.subscribe(params => {
    //   this.userId = params['id'];
    //   if (!this.userId) {
    //     this.openSnackBar('Ошибка при аутентификации пользователя', '')
    //   }
    // });

  }

  save() {
    this.commonService.checkUserByPhone(this.user.phoneNumber).then(res => {
      console.log(res);
      if (!res) {
        this.commonService.saveUser(this.user).then(res => {
          this.user = {
            idn: "",
            lastname: "",
            firstname: "",
            gender: "",
            birthdate: new Date(),
            phoneNumber: "",
            city: "",
            userId: "",
            status:"created"
          };
          this.openSnackBar('Пользователь создан', '');
        });
      } else
        this.openSnackBar('Пользователь с таким номером уже зарегестрирован', '');
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
