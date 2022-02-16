import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.page.html',
  styleUrls: ['./order-form.page.css'],
})
export class OrderFormPage implements OnInit {
  constructor(breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }
  stepperOrientation: Observable<StepperOrientation>;
  ngOnInit() {
    this.retriveUser();
  }

  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  userInfo: any = {};
  userId: string = '';
  userEmail: any = '';
  userDetails: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    userPhoneNo: new FormControl('', [Validators.required]),
    userEmail: new FormControl(''),
  });
  addressForm: FormGroup = new FormGroup({
    userAddress: new FormControl('', [Validators.required]),
  });

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
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
        this.userDetails.reset();
        this.setValues();
      });
    });
  }
  setValues() {
    this.userDetails.controls['userName'].setValue(this.userInfo.name);
    this.userDetails.controls['userPhoneNo'].setValue(this.userInfo.phoneNo);
    this.userDetails.controls['userEmail'].setValue(this.userEmail);
    this.addressForm.controls['userAddress'].setValue(this.userInfo.address);
  }

  setuserInfo() {
    const docRef = doc(this.db, 'users', this.userId, 'User', 'UserInfo');
    setDoc(docRef, {
      name: this.userDetails.controls['userName'].value,
      email: this.userEmail,
      phoneNo: this.userDetails.controls['userPhoneNo'].value,
      address: this.addressForm.controls['userAddress'].value,
    }).catch(() => {
      console.log('retry');
    });
    this.getUserValues();
  }

  // firstFormGroup = this._formBuilder.group({
  //   firstCtrl: ['', Validators.required],
  // });
  // secondFormGroup = this._formBuilder.group({
  //   secondCtrl: ['', Validators.required],
  // });
  // thirdFormGroup = this._formBuilder.group({
  //   thirdCtrl: ['', Validators.required],
  // });
}
