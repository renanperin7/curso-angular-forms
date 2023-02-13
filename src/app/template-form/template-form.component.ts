import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  }

  constructor(private http: HttpClient) {

  }

  ngOnInit() {

  }

  onSubmit(formulario: any) {
    this.http.post('https://httpbin.org/post', JSON.stringify(formulario.value)).pipe(map((res: any) => res))
    .subscribe(dados => {
      console.log(dados)
      formulario.form.reset()
    });
  }

  consultaCep(cep: any, form: any) {
    cep.replace(/\D/g, '');

    if (cep != "") {
      var validacep = /^[0-9]{8}$/;

      if(validacep.test(cep)) {

        this.resetaDadosForm(form)

        this.http.get(`//viacep.com.br/ws/${cep}/json`).pipe(map((dados: any) => dados))
        .subscribe(dados => this.populaDadosForm(dados, form));

      }
    }
  }

  populaDadosForm(dados: any, formulario: any) {
    // formulario.setValue({
    //   nome: formulario.value.nome,
    //   email: formulario.value.email,
    //   endereco: {
    //     rua: dados.logradouro,
    //     cep: dados.cep,
    //     numero: '',
    //     complemento: dados.complemento,
    //     bairro: dados.bairro,
    //     cidade: dados.localidade,
    //     estado: dados.uf
    //   }
    // })

    formulario.form.patchValue({
      endereco: {
        rua: dados.logradouro,
        // cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })
  }

  resetaDadosForm(formulario: any) {
    formulario.form.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    })
  }

}
