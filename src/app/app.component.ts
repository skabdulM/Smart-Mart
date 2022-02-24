import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
} from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {}
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  provider = new GoogleAuthProvider();
  userId: string = '';

  ngOnInit() {
    this.retriveUser();
  }

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
        this.addUser();
      } else {
        this.loginGmail();
      }
    });
  }

  addUser() {
    const docRef = doc(this.db, 'users', this.userId);
    setDoc(docRef, {})
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }

  loginGmail() {
    signInWithRedirect(this.auth, this.provider);
    this.router.navigate(['/user']);
  }
}
