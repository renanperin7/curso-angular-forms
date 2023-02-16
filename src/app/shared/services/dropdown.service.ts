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

  getCargos() {
    return [
      {
        nome: 'Dev',
        nivel: 'Junior',
        desc: 'Dev Jr'
      },
      {
        nome: 'Dev',
        nivel: 'Pleno',
        desc: 'Dev Pleno'
      },
      {
        nome: 'Dev',
        nivel: 'Senior',
        desc: 'Dev Sr'
      },
    ]
  }

}
