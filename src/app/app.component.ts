import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
} from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { SlidesComponent } from './slides/slides.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, public dialog: MatDialog) {}
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  provider = new GoogleAuthProvider();
  userId: string = '';

  ngOnInit() {
    this.retriveUser();
  }

  openDialog() {
    this.dialog.open(SlidesComponent, {
      width: '650px',
      height: '500px',
    });
  }

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
        this.addUser();
        this.redirectResult();
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

  async loginGmail() {
    await signInWithRedirect(this.auth, this.provider);
  }

  async redirectResult() {
    const result = await getRedirectResult(this.auth);
    if (result !== null) {
      this.router.navigate(['/home']);
      this.openDialog();
    } else {
      // console.log('ok');
    }
  }
}
