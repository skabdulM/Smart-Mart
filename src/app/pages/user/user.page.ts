import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.css'],
})
export class UserPage implements OnInit {
  constructor(public toastController: ToastController) {}

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
    const docRef = doc(this.db, 'users', this.userId, 'User', 'UserInfo');
    onSnapshot(docRef, (doc) => {
      this.userInfo = {};
      // snapshot.docs.forEach((doc) => {
      this.userInfo = doc.data();
      this.userPage.reset();
      this.setValues();
      // });
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
        this.presentToast('User Details Updated');
      })
      .catch((error) => {
        console.log(error);
      });
    // this.getUserValues();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      color:"primary",
      message,
      duration: 1500,
    });
    toast.present();
  }
}
