import { Component } from '@angular/core';
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
        console.log('user added');
      } else {
        this.loginGmail();
      }
    });
  }

  addUser() {
    const docRef = doc(this.db, 'users', this.userId);
    setDoc(docRef, {}).catch(() => {
      console.log("Can't acess db");
    });
  }

  loginGmail() {
    signInWithRedirect(this.auth, this.provider);
  }
}
