import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

import { DropdownService } from './../shared/services/dropdown.service';
import { Estadobr } from '../shared/models/estadobr';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit{

  formulario!: FormGroup;

  estados!: Estadobr[];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService
    ) {
  }

  ngOnInit() {

    this.dropdownService.getEstadoBr().subscribe(dados => {this.estados = dados, console.log(dados)})

    // this.formulario = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null)
    // })

    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    })

  }

  onSubmit() {
    if(this.formulario.valid) {

      this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value)).pipe(map((res: any) => res))
      .subscribe(dados => {
        console.log(dados);
        // reset form
        // this.formulario.reset()
        this.resetar()
      },
      // (_error: any) => alert('erro')
      );
    } else {
     this.verificaValidacoesForm(this.formulario)
    }
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      const controle = formGroup.get(campo)

      controle?.markAsDirty()

      if(controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle)
      }

    })
  }

  resetar() {
    this.formulario.reset()
  }

  consultaCep() {

    let cep: string = this.formulario.get('endereco.cep')?.value

    if(cep != null && cep !== '') {
      this.cepService.consultaCep(cep).subscribe(dados => this.populaDadosForm(dados));
    }
  }

  populaDadosForm(dados: any) {

    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        // cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })

    this.formulario.get('nome')?.setValue('Renan')
    this.formulario.get('email')?.setValue('renan@email.com')
  }

  resetaDadosForm() {

    this.formulario.patchValue({
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
