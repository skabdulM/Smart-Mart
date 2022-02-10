import { Component } from '@angular/core';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'smart-mart';
  ngOnInit() {
    // this.fireConnect();
  }
  // books: any = [];
  // fireConnect() {
  //   const app = initializeApp(environment.firebaseConfig);
  //   const firestore = getFirestore(app);
  //   const analytics = getAnalytics(app);
  //   const db = getFirestore();
  //   const colRef = collection(db, 'books');
  //   getDocs(colRef)
  //     .then((snapshot) => {
  //       snapshot.docs.forEach((doc) => {
  //         this.books.push({ ...doc.data(), id: doc.id });
  //       });
  //       console.log(this.books);
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // }
}
