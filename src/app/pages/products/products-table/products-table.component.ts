import { Component, OnInit } from '@angular/core';
import { Products } from 'src/app/products';
import { initializeApp } from 'firebase/app';
import {
  collection,
  getFirestore,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { EditProductdailogComponent } from '../edit-productdailog/edit-productdailog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.css'],
})
export class ProductsTableComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public toastController: ToastController
  ) {}
  products: Products[] = [];
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore();
  displayedColumns = [
    'srNo',
    'productName',
    'productDescription',
    'productPrice',
    'editProduct',
    'deleteProduct',
  ];

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    const docRef = collection(this.db, 'products');
    const OrderBy = query(docRef, orderBy('productName', 'asc'));
    onSnapshot(OrderBy, (snapshot) => {
      this.products = [];
      snapshot.docs.forEach((doc) => {
        this.products.push({ ...doc.data(), id: doc.id });
      });
    });
  }

  editProduct(product: Products) {
    const dialogRef = this.dialog.open(EditProductdailogComponent, {
      width: '650px',
      data: product,
    });
    dialogRef.afterClosed().subscribe((addProduct) => {
      if (addProduct.redirect === 'update') {
        const docRef = doc(this.db, 'products', addProduct.productId);
        updateDoc(docRef, {
          productName: addProduct.productName,
          productDescription: addProduct.productDescription,
          productImage: addProduct.productImage,
          productPrice: addProduct.productAmount,
        })
          .then(() => {
            this.presentToast('Product Updated!!');
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.presentToast('Nothing changed');
      }
    });
  }

  deleteProduct(id: string) {
    const docRef = doc(this.db, 'products', id);
    deleteDoc(docRef).then(() => {
      this.presentToast('Product Deleted 😞😞 !!');
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
    });
    toast.present();
  }
}
