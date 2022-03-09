import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-totalorders',
  templateUrl: './totalorders.component.html',
  styleUrls: ['./totalorders.component.css'],
})
export class TotalordersComponent implements OnInit {
  constructor() {}
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore();
  ordersId: any = [];
  product: any = [];
  displayedColumns = [
    'srNo',
    'ordersId',
    'userId',
    'paymentId',
    'status',
    'totalAmount',
    'invoice',
  ];
  OrderedProducts: any = [];
  productNames: any = [];
  productPrice: any = [];
  productQuantity: any = [];

  ngOnInit() {
    this.fetchProducts();
  }

  updateStatus(orderId: string, userId: string, status: string) {
    if (status == 'undelivered') {
      const docRef = doc(this.db, 'totalorders', orderId);
      updateDoc(docRef, {
        status: 'delivered',
      })
        .then(() => {
          const ref = doc(this.db, 'users', userId, 'Orders', orderId);
          updateDoc(ref, {
            status: 'delivered',
          }).catch((error) => {
            alert(error);
          });
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      const docRef = doc(this.db, 'totalorders', orderId);
      updateDoc(docRef, {
        status: 'undelivered',
      })
        .then(() => {
          const ref = doc(this.db, 'users', userId, 'Orders', orderId);
          updateDoc(ref, {
            status: 'undelivered',
          }).catch((error) => {
            alert(error);
          });
        })
        .catch((error) => {
          alert(error);
        });
    }
  }

  fetchProducts() {
    const docRef = collection(this.db, 'totalorders');
    const OrderBy = query(docRef, orderBy('createdAt', 'desc'));
    onSnapshot(OrderBy, (snapshot) => {
      this.ordersId = [];
      snapshot.docs.forEach((doc) => {
        this.ordersId.push({
          orderId: doc.id,
          userId: doc.get('user'),
          useremailId: doc.get('email'),
          status: doc.get('status'),
          amount: doc.get('totalAmount'),
          paymentId: doc.get('paymentID'),
        });
      });
    });
  }

  fetchProduct(user: string, orderId: string) {
    const docRef = doc(this.db, 'users', user, 'Orders', orderId);
    this.productNames = [];
    this.productPrice = [];
    this.productQuantity = [];
    onSnapshot(docRef, (doc) => {
      this.product = doc.data();
      this.OrderedProducts = this.product.orderedProducts;
      this.OrderedProducts.forEach((element: any) => {
        this.productNames.push(element.productName); //every elemt of order name
        this.productPrice.push(
          '₹' + element.productPrice * element.productQuantity
        );
        this.productQuantity.push(element.productQuantity);
      });
      this.createPDF(orderId, this.product);
    });
  }

  createPDF(orderId: any, info: any) {
    const data: any = this.getDocumentDefinition(
      info,
      orderId,
      this.productNames,
      this.productPrice,
      this.productQuantity
    );
    pdfMake.createPdf(data).open();
  }
  getDocumentDefinition(
    info: any,
    orderId: string,
    productNames: any,
    productPrice: number,
    productQuantity: number
  ) {
    return {
      content: [
        {
          text: 'Invoice',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          text: 'Order ID: #' + orderId,
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 8],
        },
        {
          text: 'Ordered At: ' + info.createdAt.toDate(),
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 8],
        },
        {
          text: 'Name: ' + info.userName,
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 8],
        },
        {
          text: 'Address: ' + info.address,
          fontSize: 14,
          margin: [0, 20, 0, 8],
        },
        {
          text: 'Contact Details: ' + info.phoneNo,
          fontSize: 14,
          margin: [0, 20, 0, 8],
        },
        {
          text: 'Email Id: ' + info.email,
          fontSize: 14,
          margin: [0, 20, 0, 8],
        },
        {
          text: 'Payment Methode: ' + info.paymentID,
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 8],
        },
        {
          text: 'Delivery Status: ' + info.status,
          fontSize: 14,
          margin: [0, 20, 0, 8],
        },

        // { '#': id },
        {
          text: 'Product Details',
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 8],
        },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            body: [
              [
                { text: 'Product Name', style: 'tableHeader' },
                { text: 'Quantity', style: 'tableHeader' },
                { text: 'Total Price ', style: 'tableHeader' },
              ],
              [productNames, productQuantity, productPrice],
            ],
          },
          layout: 'lightHorizontalLines',
        },
        {
          text: 'Total Amount : ₹' + info.totalAmount,
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 8],
        },
      ],
      styles: {
        name: {
          fontSize: 16,
          bold: true,
        },
      },
    };
  }
}
