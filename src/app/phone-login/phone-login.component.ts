import {Component, OnInit} from '@angular/core';
import {WindowService} from "../shared/window.service";
import {PhoneNumber} from "./phonenumber-model";
import * as firebase from 'firebase'
import {FormBuilder} from "@angular/forms";
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

  disableButton = false;

  constructor(private win: WindowService,
              public snackBar: MatSnackBar,
              private commonService: CommonService,
              private router: Router,
              private cookieService: CookieService) {
  }

  ngOnInit() {
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

  convertStringToPhone() {
    this.phoneNumber.country = '7';
    this.phoneNumber.area = this.phoneString.substr(1, 3);
    this.phoneNumber.prefix = this.phoneString.substr(4, 3);
    this.phoneNumber.line = this.phoneString.substr(7, 4);
    console.log(this.phoneNumber);
  }

  sendLoginCode() {
    this.disableButton = true;
    const appVerifier = this.windowRef.recaptchaVerifier;

    this.convertStringToPhone();
    const num = this.phoneNumber.e164;

    //
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {

        this.windowRef.confirmationResult = result;
        this.disableButton = false;
      })
      .catch(error => {
        this.openSnackBar('Аккаунт с таким номером не найден','');
        console.log(error);
      });

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  verifyLoginCode() {
    this.disableButton = true;
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {

        this.commonService.getUserByPhone(this.phoneString).then(res=>{
          if(res && res[0]){
            let expiredDate = new Date();
            expiredDate.setHours(expiredDate.getHours() + 1);
            console.log("EXPIRES: ", expiredDate);

            let reUser:any  = res[0];
            this.user = result.user;
            console.log("res: ", res[0], " this.user.uid: " + this.user.uid);
            if(reUser.status === 'created'){
              this.commonService.updateUserId(reUser, this.user.uid).then(res=>{
                this.cookieService.set('userId', reUser.id, expiredDate);
                this.openSnackBar('Вы успешно авторизовались', '');
                this.router.navigateByUrl('');
              });
            }else{
              this.cookieService.set('userId', reUser.id, expiredDate);
              this.openSnackBar('Вы успешно авторизовались', '');
              this.router.navigateByUrl('');
            }
          }else{
            this.openSnackBar("Аккаунт не найден. Свяжитесь с администратором.","");
            console.log("error kind of 1");
          }
        }, err=>{
          this.openSnackBar("Аккаунт не найден. Свяжитесь с администратором.","");
          console.log("error kind of 2: ", err);
        });

      })
      .catch(error => {
        this.disableButton = false;
        this.openSnackBar("Введенный код не правильный","");
        console.log(error, "Incorrect code entered?")});
  }


}

