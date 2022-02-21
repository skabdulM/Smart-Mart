import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.css'],
})
export class UserPage implements OnInit {
  constructor(private snackBar: MatSnackBar) {}

  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  userInfo: any = {};
  userId: string = '';
  userEmail: any = '';
  userPage: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    userPhoneNo: new FormControl('', [
      Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
    ]),
    userAddress: new FormControl('', [Validators.required]),
    userEmail: new FormControl(''),
  });

  ngOnInit() {
    this.retriveUser();
  }

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
        this.userEmail = user.email;
        this.getUserValues();
      } else {
        console.log('somthing is fishy');
      }
    });
  }

  getUserValues() {
    const docRef = collection(this.db, 'users', this.userId, 'User');
    onSnapshot(docRef, (snapshot) => {
      this.userInfo = {};
      snapshot.docs.forEach((doc) => {
        this.userInfo = { ...doc.data() };
        this.userPage.reset();
        this.setValues();
      });
    });
  }

  setValues() {
    this.userPage.controls['userName'].setValue(this.userInfo.name);
    this.userPage.controls['userPhoneNo'].setValue(this.userInfo.phoneNo);
    this.userPage.controls['userAddress'].setValue(this.userInfo.address);
    this.userPage.controls['userEmail'].setValue(this.userEmail);
  }

  setuserInfo() {
    const docRef = doc(this.db, 'users', this.userId, 'User', 'UserInfo');
    setDoc(docRef, {
      name: this.userPage.controls['userName'].value,
      email: this.userEmail,
      phoneNo: this.userPage.controls['userPhoneNo'].value,
      address: this.userPage.controls['userAddress'].value,
    })
      .then(() => {
        this.openSnackBar('User Details Updates ', 'Ok');
      })
      .catch((error) => {
        console.log(error);
      });
    // this.getUserValues();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 2500 });
  }
}
