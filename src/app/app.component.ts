import { Component } from '@angular/core';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'smart-mart';
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  provider = new GoogleAuthProvider();
  userId: string = '';

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
        this.retriveUser();
      } else {
        this.loginGmail();
      }
    });
  }

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user?.uid == this.userId) {
        this.addUser();
        // console.log('user added');
      } else {
        this.loginGmail()
      }
    });
  }
  addUser() {
    const docRef = doc(this.db, 'users', this.userId);
    setDoc(docRef, {}).catch(() => {
      console.log('retry');
    });
  }
  loginGmail() {
    signInWithRedirect(this.auth, this.provider);
  }
}
