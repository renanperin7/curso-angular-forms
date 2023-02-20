import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerficaEmailService {

  constructor(private http: HttpClient) { }

  verificarEmail(email: string): Observable<any> {
    return this.http.get<any>('assets/dados/verificarEmail.json')
    .pipe(
      delay(8000),
      map((dados: {emails: any[]}) => dados.emails),
      // tap(console.log),
      map((dados: {email: string}[]) => dados.filter(v => v.email === email)),
      // tap(console.log),
      map((dados: any[]) => dados.length > 0),
      // tap(console.log)
    )
  }
}
