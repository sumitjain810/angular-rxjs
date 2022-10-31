import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  empId: Number;
  empName: String;
  status: String;
  designation: String;
  address: String;
}
@Component({
  selector: 'app-dialog-content-example-dialog',
  templateUrl: './dialog-content-example-dialog.component.html',
  styleUrls: ['./dialog-content-example-dialog.component.css'],
})
export class DialogContentExampleDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.initialization();
  }

  initialization = () => {
    this.data = {
      empId: 0,
      empName: '',
      status: '',
      designation: '',
      address: '',
    };
  };

  onNoClick(): void {
    this.dialogRef.close();
  }
}
