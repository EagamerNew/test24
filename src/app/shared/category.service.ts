import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import {deprecate} from "util";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private firebase: AngularFirestore) { }

  getCotegories(){
    return this.firebase.collection('question',ref=>ref.where('status','==', 'active')).snapshotChanges();
  }

  getCategories(){
    return this.firebase.collection('category').snapshotChanges();
  }
  

}
