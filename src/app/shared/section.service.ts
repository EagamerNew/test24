import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  constructor(private firebase: AngularFirestore) { }

  getSections(){
    return this.firebase.collection('section').snapshotChanges()
  }

  getSectionsByCategory(id){
    return this.firebase.collection("section", ref => ref.where("categoryId", "==", id)).snapshotChanges()
  }
}
