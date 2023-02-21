import { FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-form',
  template: '<br>'
})
export abstract class BaseFormComponent implements OnInit {

  formulario!: FormGroup

  constructor() { }

  ngOnInit() {
  }

  abstract submit(): any

  onSubmit(){
    if(this.formulario.valid) {
      this.submit()
    } else {
      this.verificaValidacoesForm(this.formulario)
     }
  }

  verificaValidacoesForm(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((campo) => {
      const controle = formGroup.get(campo)

      controle?.markAsDirty()
      controle?.markAsTouched()

      if(controle instanceof FormGroup || controle instanceof FormArray) {
        this.verificaValidacoesForm(controle)
      }

    })
  }

  resetar() {
    this.formulario.reset()
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formulario.get(campo)?.valid &&
      (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.valid)
    )
  }

  verificaRequired(campo: string) {
    return (
      !this.formulario.get(campo)?.hasError('required') &&
      (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.valid)
    )
  }

  verificaEmailInvalido() {
    const campoEmail = this.formulario.get('email')
    if(campoEmail?.errors) {
      return campoEmail.errors['email'] && campoEmail.touched
    }
  }

  getCampo(campo: string) {
    return this.formulario.get(campo)
  }

}
