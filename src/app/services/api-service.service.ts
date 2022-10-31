import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private searchURL = 'http://localhost:8080/employee/search';
  private getURL = 'http://localhost:8080/employee/getAll';
  private postURL = 'http://localhost:8080/employee/save';
  private deleteURL = 'http://localhost:8080/employee/delete';
   
  constructor(private httpClient: HttpClient) { }
  
  searchEmployee(text: String){
    return this.httpClient.get(this.searchURL + `?text=${text}`);
  }

  getAllEmployees(){
    return this.httpClient.get(this.getURL);
  }

  saveEmployee(data: any){
    return this.httpClient.post(this.postURL, data);
  }

  deleteEmployee(data: any){
    return this.httpClient.post(this.deleteURL, data);
  }
  
}