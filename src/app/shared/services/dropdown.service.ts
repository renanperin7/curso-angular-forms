import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Estadobr } from '../models/estadobr';
import { Cidade } from './../models/cidade';


@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getEstadoBr() {
    return this.http.get<Estadobr[]>('assets/dados/estadosbr.json').pipe();
  }

  getCidades(idEstado: number) {
    return this.http.get<Cidade[]>('assets/dados/cidades.json').pipe(
      map((cidades: Cidade[]) => cidades.filter(c => c.estado == idEstado))
    );
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

  getTecnologias() {
    return [
      {
        nome: 'Java',
        desc: 'Java'
      },
      {
        nome: 'Javascript',
        desc: 'Javascript'
      },
      {
        nome: 'Typescript',
        desc: 'TypeScript'
      },
      {
        nome: 'Node',
        desc: 'Node'
      },
    ]
  }

  getNewsletter() {
    return [
      {
        valor: 's',
        desc: 'Sim'
      },
      {
        valor: 'n',
        desc: 'Não'
      }
    ]
  }

}
