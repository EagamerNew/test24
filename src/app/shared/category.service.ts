import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private firebase: AngularFirestore) { }

  getCotegories(){
    return this.firebase.collection('question',ref=>ref.where('status','==', 'active')).snapshotChanges();
  }
  

}
