import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddProductDailogComponent } from './add-product-dailog/add-product-dailog.component';
// import { QRCodeElementType, QRCodeErrorCorrectionLevel } from 'angularx-qrcode';
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.css'],
})
export class ProductsPage implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openDialog() {
    const dialogRef = this.dialog.open(AddProductDailogComponent, {
      width: '650px',
      // data: note,
    });
    // dialogRef.afterClosed().subscribe({
    //   next: (result) => {
    //     if (result.redirect === 'delete') {
    //       this.noteService.deleteNote(result).subscribe(() => this.fetchNote());
    //       this.openSnackBar('Note Deleted !!', '');
    //     }else if(result.redirect === 'close'){

    //     }
    //     else {
    //       this.noteService.updateNote(result).subscribe(() => this.fetchNote());
    //       this.openSnackBar('Note Updated !!', 'Ok');
    //     }
    //   },
    // });
  }
}
