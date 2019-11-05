import {Injectable} from "@angular/core";
import {FireSQL} from "firesql";
import {AngularFirestore} from "@angular/fire/firestore";
import {CookieService} from "ngx-cookie-service";
import * as firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private fireDB;
  private fireSQL: FireSQL;

  constructor(private firestore: AngularFirestore, private cookieService: CookieService) {
    this.fireDB = firebase.firestore();
    this.fireSQL = new FireSQL(this.fireDB);
  }


}
