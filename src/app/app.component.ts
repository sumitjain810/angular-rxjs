import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiServiceService } from './services/api-service.service';
import { Observable } from 'rxjs';
import {
  map,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  startWith,
  retry,
} from 'rxjs/operators';

import { DialogContentExampleDialogComponent } from './dialog-content-example-dialog/dialog-content-example-dialog.component';
import { FormControl } from '@angular/forms';

export interface MyResults {
  empId: Number;
  empName: String;
  status: String;
  designation: String;
  address: String;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  results: any = Observable<MyResults[]>;
  search: FormControl = new FormControl('');

  displayedColumns: string[] = [
    'empId',
    'empName',
    'status',
    'designation',
    'address',
  ];
  employeeList: any[] = [];
  toggleSort: number = -1;

  showLoader: boolean = false;

  constructor(public dialog: MatDialog, private api: ApiServiceService) {
    this.results = this.search.valueChanges.pipe(
      map((search) => search.trim()), // trims spaces
      debounceTime(200), // waits for 200ms for typing to be stopped
      distinctUntilChanged(), // compares last value
      filter((search) => search !== ''), // ignores empty string
      switchMap((search) =>
        this.api.searchEmployee(search).pipe(retry(3), startWith([])) // 3 retries, initial = []
      )
    );
  }

  ngOnInit() {
    this.initialization();
  }

  initialization = async () => {
    this.showLoader = true;
    this.api.getAllEmployees().subscribe((response: any) => {
      this.showLoader = false;
      console.log('Response: ', response);
      this.employeeList = response;
    });
  };

  delete = (element: any) => {
    console.log('element: ', element);

    const index = this.employeeList.indexOf(element);
    console.log('Index: ', index);

    if (index !== -1) {
      this.api
        .deleteEmployee({ id: element._id })
        .subscribe((response: any) => {
          console.log('Response: ', response);
          this.employeeList.splice(index, 1);
          this.employeeList = [...this.employeeList];
          console.log('updated employeeList: ', this.employeeList);
        });
    }
  };

  add = () => {
    const dialogRef = this.dialog.open(DialogContentExampleDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result:', result);
      if (
        result.empId &&
        result.empName &&
        result.status &&
        result.designation &&
        result.address
      ) {
        this.api.saveEmployee(result).subscribe((response: any) => {
          console.log('Response: ', response);
          this.employeeList.push(response);
          this.employeeList = [...this.employeeList];
        });
      } else {
        alert('Please fillup all the details...');
      }
    });
  };

  sort = () => {
    // Sort based on size
    this.toggleSort = -this.toggleSort;
    this.employeeList.sort((a, b) =>
      parseInt(a.empId) > parseInt(b.empId) ? this.toggleSort : -this.toggleSort
    );
    this.employeeList = [...this.employeeList];
    console.log('this.employeeList: ', this.employeeList);
  };
}
