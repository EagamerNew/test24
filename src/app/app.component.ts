import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import {environment} from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-latest-web-app';

  ngOnInit(): void {

    firebase.initializeApp(
      environment.firebaseConfig
    );
  }

  onChanged(increased: any) {
    console.log('app component hello!');
  }

}
