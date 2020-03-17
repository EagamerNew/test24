import {Component, OnInit} from '@angular/core';
import {User} from "../shared/model/user";
import {CookieService} from "ngx-cookie-service";
import {CommonService} from "../shared/common.service";
import {MatSnackBar} from "@angular/material";
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    user: any;
    gender = [{code: 'male', name: "мужской"},
        {code: 'female', name: "женский"}];

    cities = [{code: 'almaty', name: "Алматы"},
        {code: 'taraz', name: "Тараз"}];

    docUserId: string;
    isDefault: boolean = true;
    newPassword;

    examHistory: any[] = [];

    constructor(private cookieService: CookieService,
                private commonService: CommonService,
                private route: ActivatedRoute,
                private router: Router,
                private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.docUserId = params['id'];
            if (this.docUserId) {
                this.cookieService.set('title', 'Профиль');
                this.isDefault = false;
                this.getUserByDocId();
            } else {
                this.cookieService.set('title', 'Мой профиль');
                if (this.docUserId = this.cookieService.get('userId')) {
                    this.getUserByDocId();
                    this.getExamHistory();
                }
            }
        });
    }

    getExamHistory() {
        this.commonService.getExamHistoryByUserId(this.docUserId).then(res => {
            this.examHistory = res.map(mapper => {
                if (mapper.date) {
                    const date = mapper.date.split('-');
                    mapper['realDate'] = date[0] + ' ' + this.monthInRus(parseInt(date[1])) + ' ' + date[2];
                }
                return mapper;
            });
        })
    }

    public get sortedArray(): any[] {
        return this.examHistory.sort((val1, val2) => {
                const vall2 =<any> new Date(val2.date);
                const vall1 = <any>new Date(val1.date);
                vall2.setTime(val2.time);
                vall1.setTime(val1.time);
                return  vall2 - vall1;
            }
        );
    }

    calculatePercent(score, scoreMust) {
        // const all: number = parseInt(correct) + parseInt(mistake);
        // return ((correct * 100) / (all)).toFixed();
        return ((parseInt(score) * 100) / parseInt(scoreMust)).toFixed();
    }

    calculateRealDate(dateIn) {
        const date = dateIn.split('-');
        return date[0] + ' ' + this.monthInRus(parseInt(date[1])) + ' ' + date[2];
    }

    trackByFn(index, item) {
        return index;
    }

    monthInRus(month: number) {
        switch (month) {
            case 1:
                return 'янв';
                break;
            case 2:
                return 'фев';
                break;
            case 3:
                return 'март';
                break;
            case 4:
                return 'апр';
                break;
            case 5:
                return 'май';
                break;
            case 6:
                return 'июнь';
                break;
            case 7:
                return 'июль';
                break;
            case 8:
                return 'авг';
                break;
            case 9:
                return 'сен';
                break;
            case 10:
                return 'окт';
                break;
            case 11:
                return 'ноя';
                break;
            case 12:
                return 'дек';
                break;
        }
    }


    showMessage(message: string): void {
        this.snackBar.open(message, '', {duration: 1500});
    }

    updateRoleAndCompanyId(userDocId): void {
        this.commonService.updateRoleAndCompanyId(userDocId, 'user', '').then(res => {
            this.showMessage('Сотрудник успешно удален');
            this.router.navigateByUrl('')
        });
    }

    getUserByDocId() {
        this.commonService.getUserByDocId(this.docUserId).then(res => {
            console.log('res: ', res);
            this.user = res[0];
        })
    }

    setNewPassword() {
        this.commonService.updateUserPassword(this.docUserId, this.newPassword).then(res => {
            this.newPassword = "";
            this.openSnackBar("Пароль успешно изменен");
        });
    }

    openSnackBar(message) {
        this.snackBar.open(message, "", {
            duration: 1000
        });
    }

}
