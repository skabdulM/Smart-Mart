import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-addto-cartdailog',
  templateUrl: './addto-cartdailog.component.html',
  styleUrls: ['./addto-cartdailog.component.css'],
})
export class AddtoCartdailogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddtoCartdailogComponent>) {
    // dialogRef.disableClose = true;
  }

  ngOnInit() {}
}
