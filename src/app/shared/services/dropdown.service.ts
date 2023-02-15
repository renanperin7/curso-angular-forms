import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Estadobr } from '../models/estadobr';


@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getEstadoBr() {
    return this.http.get<Estadobr[]>('assets/dados/estadosbr.json').pipe();
  }

}
