import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  constructor() {}
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  userInfo: any = {};
  userId: string = '';
  db = getFirestore();
  userImg: any;
  ngOnInit() {
    this.retriveUser();
  }

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
        this.userImg = user.photoURL;
        this.getUserValues();
      } else {
      }
    });
  }

  getUserValues() {
    const docRef = collection(this.db, 'users', this.userId, 'User');
    onSnapshot(docRef, (snapshot) => {
      this.userInfo = {};
      snapshot.docs.forEach((doc) => {
        this.userInfo = { ...doc.data() };
      });
    });
  }

  signout() {
    signOut(this.auth)
      .then(() => {
        alert('Logged Out');
        location.reload()
      })
      .catch((error) => {
        alert(error);
      });
  }
}
