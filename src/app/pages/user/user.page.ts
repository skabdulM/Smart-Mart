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
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.css'],
})
export class UserPage implements OnInit {
  constructor() {}

  userPage: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    userPhoneNo: new FormControl('', [Validators.required]),
    userAddress: new FormControl('', [Validators.required]),
  });

  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  userInfo: any = {};
  userId: string = '';
  userEmail: any = '';

  ngOnInit() {
    this.userCheck();
  }

  userCheck() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userId = user.uid;
        this.userEmail = user.email;
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
        this.setValues();
      });
    });
  }

  setValues() {
    this.userPage.controls['userName'].setValue(this.userInfo.name);
    this.userPage.controls['userPhoneNo'].setValue(this.userInfo.phoneNo);
    this.userPage.controls['userAddress'].setValue(this.userInfo.address);
  }

  setuserInfo() {
    const docRef = doc(this.db, 'users', this.userId, 'User', 'UserInfo');
    setDoc(docRef, {
      name: this.userPage.controls['userName'].value,
      email: this.userEmail,
      phoneNo: this.userPage.controls['userPhoneNo'].value,
      address: this.userPage.controls['userAddress'].value,
    }).catch(() => {
      console.log('retry');
    });
  }
}
