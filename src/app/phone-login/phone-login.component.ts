import {Component, OnInit} from '@angular/core';
import {WindowService} from "../shared/window.service";
import {PhoneNumber} from "./phonenumber-model";
import * as firebase from 'firebase'
import {MatSnackBar} from "@angular/material";
import {CommonService} from "../shared/common.service";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.css']
})
export class PhoneLoginComponent implements OnInit {
  windowRef: any;

  phoneNumber = new PhoneNumber()

  verificationCode: string;

  user: any;

  phoneString: string = "";
  phoneCode: string = "";
  password: string;

  disableButton = false;
  snackBarRef: any;
  main = true;

  constructor(private win: WindowService,
              public snackBar: MatSnackBar,
              private commonService: CommonService,
              private router: Router,
              private cookieService: CookieService) {
  }

  ngOnInit() {
    this.cookieService.set('title', 'Вход');
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function (response) {
        console.log("success");
        // this.response.confirm(this.phoneCod).then(res=>{
        // }, err=>{
        //   alert("you have an error");
        // })
      }
    });
  }

  backToMainLogin() {
    this.windowRef.confirmationResult = null;
    this.router.navigateByUrl('/login-phone');
  }

  convertStringToPhone() {
    this.phoneNumber.country = '7';
    this.phoneNumber.area = this.phoneString.substr(0, 3);
    this.phoneNumber.prefix = this.phoneString.substr(3, 3);
    this.phoneNumber.line = this.phoneString.substr(6, 4);
    console.log(this.phoneNumber, ' ', this.phoneString);
  }

  sendLoginCode() {
    this.disableButton = true;
    const appVerifier = this.windowRef.recaptchaVerifier;

    this.convertStringToPhone();
    const num = this.phoneNumber.e164;

    //

    this.commonService.getUserByPhone(this.phoneString).then(res => {
      if (res && res[0]) {
        firebase.auth().signInWithPhoneNumber(num, appVerifier)
          .then(result => {

            this.windowRef.confirmationResult = result;
            this.disableButton = false;
          })
          .catch(error => {
            this.openSnackBar('Аккаунт с таким номером не найден', '');
            console.log(error);
          });
      } else {
        this.disableButton = false;
        this.openSnackBar("Аккаунт не найден. Свяжитесь с администратором.", "");
        console.log("error kind of -1");
      }
    });


  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1000,
    });
  }

  verifyLoginCode() {
    this.disableButton = true;
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {

        this.commonService.getUserByPhone(this.phoneString).then(res => {
          if (res && res[0]) {
            let expiredDate = new Date();
            expiredDate.setHours(expiredDate.getHours() + 3);
            console.log("EXPIRES: ", expiredDate);

            let reUser: any = res[0];
            this.user = result.user;
            if (this.user['companyId']
                && this.user['companyId'] !== undefined
                && this.user['companyId'] !== null
                && this.user.companyId) {
              this.cookieService.set('companyId', this.user.companyId);
            }
            this.windowRef.confirmationResult = null;
            if (reUser.status === 'created') {
              this.commonService.updateUserId(reUser, this.user.uid).then(res => {
                this.cookieService.set('userId', reUser.id, expiredDate);
                this.cookieService.set('role', reUser.role, expiredDate);
                this.openSnackBar('Вы успешно авторизовались', '');

                this.snackBarRef = this.snackBar.open('Рекомендуем изменить ваш пароль', 'Изменить', {duration: 2000});

                this.snackBarRef.afterDismissed().subscribe(() => {
                  this.router.navigateByUrl('create-password');
                });
                this.router.navigateByUrl('');
              });
            } else {
              this.cookieService.set('userId', reUser.id, expiredDate);
              this.cookieService.set('role', reUser.role, expiredDate);
              this.openSnackBar('Вы успешно авторизовались', '');

              this.snackBarRef = this.snackBar.open('Рекомендуем изменить ваш пароль', 'Изменить', {duration: 2000});

              this.snackBarRef.afterDismissed().subscribe(() => {
                this.router.navigateByUrl('create-password');
              });
              this.router.navigateByUrl('');
            }
          } else {
            this.openSnackBar("Аккаунт не найден. Свяжитесь с администратором.", "");
            console.log("error kind of 1");
          }
        }, err => {
          this.openSnackBar("Аккаунт не найден. Свяжитесь с администратором.", "");
          console.log("error kind of 2: ", err);
        });

      })
      .catch(error => {
        this.disableButton = false;
        this.openSnackBar("Введенный код не правильный", "");
        console.log(error, "Incorrect code entered?")
      });
  }


  checkPhoneAndPassword() {
    this.commonService.checkPhoneAndPassword(this.phoneString, this.password).then(res => {
      let tempUser: any = res[0];
      let expiredDate = new Date();
      expiredDate.setHours(expiredDate.getHours() + 1);
      if (res && res.length > 0) {
        console.log(tempUser);

        if (tempUser['companyId'] !== undefined && tempUser['companyId'] !== null) {
          this.cookieService.set('companyId', tempUser.companyId, expiredDate);
        }
        this.cookieService.set('userId', tempUser.id, expiredDate);
        this.cookieService.set('role', tempUser.role, expiredDate);
        this.openSnackBar('Вы успешно авторизовались', '');
        this.router.navigateByUrl('');
      } else {
        this.main = false;
        // this.openSnackBar('Номер или пароль не правильный', '');
      }
    });
  }
}

