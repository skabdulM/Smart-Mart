import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.css'],
})
export class OrdersPage implements OnInit {
  constructor() {}

  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  panelOpenState = false;
  productId: any = [];
  userId: string = '';
  product: any = [];

  ngOnInit() {
    this.retriveUser();
  }

  retriveUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user !== null) {
        this.userId = user.uid;
        // this.userEmail = user.email;
        // this.getUserValues();
        this.fetchProducts();
      } else {
        // console.log('something is fishy');
      }
    });
  }

  fetchProducts() {
    const docRef = collection(this.db, 'users', this.userId, 'Orders');
    const OrderBy = query(docRef, orderBy('createdAt', 'desc'));
    onSnapshot(OrderBy, (snapshot) => {
      this.productId = [];
      snapshot.docs.forEach((doc) => {
        this.productId.push({ id: doc.id, status: doc.get('status') });
        // doc.data()
      });
    });
  }

  fetchProduct(id: string) {
    const docRef = doc(this.db, 'users', this.userId, 'Orders', id);
    onSnapshot(docRef, (doc) => {
      this.product = doc.data();
      console.log(this.product);
    });
  }
  // createPDF() {
  //  const data = this.getDocumentDefinition();
  //   pdfMake.createPdf(this.documentDefinition).open();
  // }
  // getDocumentDefinition() {
  //   return {
  //     content: [
  //       {
  //         // text: 'My Journey',
  //         text: 'Travel Bookers',
  //         bold: true,
  //         fontSize: 20,
  //         alignment: 'center',
  //         margin: [0, 0, 0, 20],
  //       },
  //       {
  //         columns: [
  //           [
  //             // {
  //             //   text: 'Purchase ID : ' + this.purchase_id,
  //             // },
  //             // {
  //             //   text: 'Customer name : ' + this.authService.userData.name,
  //             // },
  //             // {
  //             //   text: 'Customer phone : ' + this.authService.userData.phone,
  //             // },
  //             // {
  //             //   text: 'Customer email : ' + this.authService.userData.email,
  //             // },
  //             // {
  //             //   text: 'Package name : ' + this.invoice.package_title,
  //             // },
  //             // {
  //             //   text: 'Package category : ' + this.invoice.package_category,
  //             // },
  //             // {
  //             //   text: 'Destination : ' + this.invoice.package_place,
  //             // },
  //             // {
  //             //   text: 'Package amount : ' + this.invoice.package_amount,
  //             // },
  //             // {
  //             //   text:
  //             //     'Package description : ' + this.invoice.package_description,
  //             // },
  //             // {
  //             //   text: 'Number of persons : ' + this.invoice.persons,
  //             // },
  //           ],
  //         ],
  //       },
  //     ],
  //     styles: {
  //       name: {
  //         fontSize: 16,
  //         bold: true,
  //       },
  //     },
  //   };
  // }
}
