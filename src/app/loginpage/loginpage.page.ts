import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.page.html',
  styleUrls: ['./loginpage.page.css'],
})
export class LoginpagePage implements OnInit {
  constructor(private router: Router, public dialog: MatDialog) {}
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  provider = new GoogleAuthProvider();
  userId: string = '';
  userName: any = '';
  userEmail: any = '';
  userPhoneNo: any = '';
  ngOnInit() {
    this.retriveUser();
  }

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.router.navigate(['/home']);
      } else {
      }
    });
  }

  signIn() {
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        this.userId = result.user.uid;
        this.userName = result.user.displayName;
        this.userEmail = result.user.email;
        this.userPhoneNo = result.user.phoneNumber;
        const docRef = doc(this.db, 'users', result.user.uid);
        setDoc(docRef, {})
          .then(() => {})
          .catch((error) => {
            alert(error);
          });
        this.router.navigate(['/home']);
        getDoc(docRef).then((result) => {
          if (result.data() == undefined) {
            const docRef = doc(
              this.db,
              'users',
              this.userId,
              'User',
              'UserInfo'
            );
            setDoc(docRef, {
              name: this.userName,
              email: this.userEmail,
              phoneNo: this.userPhoneNo,
            })
              .then(() => {})
              .catch((error) => {
                alert(error);
              });
          } else {
          }
        });
      })
      .catch((error) => {
        alert(error);
      });
  }
}
