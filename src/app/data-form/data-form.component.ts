import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  EMPTY, Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { FormValidations } from './../shared/form-validations';
import { DropdownService } from './../shared/services/dropdown.service';
import { Estadobr } from '../shared/models/estadobr';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { VerficaEmailService } from './services/verfica-email.service';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { Cidade } from '../shared/models/cidade';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit{


  // formulario!: FormGroup;

  estados!: Estadobr[];

  cidades!: Cidade[]

  // estados!: Observable<Estadobr[]>;

  cargos!: any[]

  tecnologias!: any[]

  newsletterOp!: any[]

  frameworks = ['Angular', 'React', 'Vue']

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verficaEmailService: VerficaEmailService
    ) {
      super()
  }

  override ngOnInit() {

    // this.estados = this.dropdownService.getEstadoBr()
    this.dropdownService.getEstadoBr()
      .subscribe(dados => this.estados = dados)

    this.cargos = this.dropdownService.getCargos()

    this.tecnologias = this.dropdownService.getTecnologias()

    this.newsletterOp = this.dropdownService.getNewsletter()

    // this.verficaEmailService.verificarEmail('email@email.com').subscribe()

    // this.dropdownService.getEstadoBr().subscribe(dados => {this.estados = dados, console.log(dados)})

    // this.formulario = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null)
    // })

    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [null, [Validators.required, Validators.email], [this.validarEmail.bind(this)]],
      confirmarEmail: [null, [FormValidations.equalsTo('email')]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),

      cargo: [null],
      tecnologias: [ null],
      newsletter: ['s'],
      termos: [null, Validators.pattern('true')],
      frameworks: this.buildFrameworks()
    })

    this.formulario.get('endereco.cep')?.statusChanges
      .pipe(
        distinctUntilChanged(),
        tap(value => console.log('status CEP: ' + value)),
        switchMap(status => status === 'VALID' ?
          this.cepService.consultaCep(this.formulario.get('endereco.cep')?.value) : EMPTY)
      )
      .subscribe(dados => dados ? this.populaDadosForm(dados) : {})

      // this.dropdownService.getCidades(8).subscribe(console.log)

    this.formulario.get('endereco.estado')?.valueChanges
      .pipe(
        tap(estado => console.log(estado)),
        map((estado: any) => this.estados.filter(e => e.sigla === estado)),
        map((estados: any) => estados && estados.length > 0 ? estados[0].id : EMPTY),
        switchMap((estadoId: number) => this.dropdownService.getCidades(estadoId)),
        tap(console.log)
      )
      .subscribe(cidades => this.cidades = cidades)

  }

  buildFrameworks() {

    const values = this.frameworks.map(v => new FormControl(false))

    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(1))

    // this.formBuilder.array([
    //   new FormControl(false),
    //   new FormControl(false),
    //   new FormControl(false)
    // ])
  }

  submit() {
    let valueSubmit = Object.assign({}, this.formulario.value)

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks.map((v: any, i: any) => v ? this.frameworks[i] : null).filter((v: any) => v !== null)
    })

    this.http.post('https://httpbin.org/post', JSON.stringify(valueSubmit)).pipe(map((res: any) => res))
      .subscribe(dados => {
        console.log(dados);
        // reset form
        // this.formulario.reset()
        this.resetar()
      },
      // (_error: any) => alert('erro')
      );
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

  setarCargo() {
   const cargo = {
    nome: 'Dev',
    nivel: 'Pleno',
    desc: 'Dev Pleno'
    }
    this.formulario.get('cargo')?.setValue(cargo)
  }

  compararCargos(obj1: any, obj2: any) {
    return obj1 && obj2 ? (obj1.nome === obj2.nome) : obj1 && obj2
  }

  setarTecnologias() {
    this.formulario.get('tecnologia')?.setValue(['Java, Javascript, Typescript'])
  }

  getFrameworksControls() {
    return this.formulario.get('frameworks') ? (<FormArray>this.formulario.get('frameworks')).controls : null;
  }

  validarEmail(formControl: FormControl){
    return this.verficaEmailService.verificarEmail(formControl.value)
    .pipe(
      map((emailExiste => emailExiste ? { emailInvalido: true} : null))
    )
  }

}

