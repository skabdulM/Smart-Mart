import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AddProductDailogComponent } from '../add-product-dailog/add-product-dailog.component';
import { ProdutsTableDataSource, ProdutsTableItem } from './produts-table-datasource';

@Component({
  selector: 'app-produts-table',
  templateUrl: './produts-table.component.html',
  styleUrls: ['./produts-table.component.scss']
})

export class ProdutsTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProdutsTableItem>;
  dataSource: ProdutsTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];
  products: any=[];

  constructor() {
    this.dataSource = new ProdutsTableDataSource();
  }
  // openDialog() {
  //   const dialogRef = this.dialog.open(AddProductDailogComponent, {
  //     width: '650px',
  //     // data: note,
  //   });
  //   dialogRef.afterClosed().subscribe((addProduct) => {
  //     if (addProduct.redirect === 'save') {
  //       const product = {
  //         productId: addProduct.productId,
  //         productName: addProduct.productName,
  //         productDescription: addProduct.productDescription,
  //         productPrice: addProduct.productAmount,
  //         productImage: addProduct.productImage,
  //       };
  //       this.products.push(product);
  //     } else {
       
  //     }
  //   });
  // }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
