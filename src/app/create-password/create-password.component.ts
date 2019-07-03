import {Component, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {CommonService} from "../shared/common.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.css']
})
export class CreatePasswordComponent implements OnInit {

  docUserId: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private commonService: CommonService,
              private cookieService: CookieService,
              private router: Router,
              private matSnackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.docUserId = this.cookieService.get('userId');
  }

  setNewPassword() {
    this.commonService.updateUserPassword(this.docUserId, this.password).then(res => {
      this.password = '';
      this.confirmPassword = '';
      this.openSnackBar("Пароль успешно изменен");
      this.router.navigateByUrl('');
    });
  }

  openSnackBar(message: string){
    this.matSnackBar.open(message, '', {
      duration: 1000
    })
  }
}
