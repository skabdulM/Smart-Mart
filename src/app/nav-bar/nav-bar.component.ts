import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  constructor() {}

  ngOnInit(): void {}
  signout() {
    signOut(this.auth).then(() => {
      console.log('logged out');
    }).catch((error)=>{
      console.log("error");
      
    })
  }
}
