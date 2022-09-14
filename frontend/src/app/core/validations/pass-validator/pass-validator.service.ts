import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PassValidatorService {

  contraseñasIguales(campo1: string, campo2: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      
      const p1 = formGroup.get('infoPropietario')?.get(campo1)?.value
      const p2 = formGroup.get('infoPropietario')?.get(campo2)?.value

      // Retorno un error, si y solo si hay un error
      if (p1 !== p2) {
        // Establezco el error 
        formGroup.get('infoPropietario')?.get(campo2)?.setErrors({ noIguales: true })
        return { noIguales: true }
      }

      formGroup.get('infoPropietario')?.get(campo2)?.setErrors(null)
      // Si es null la validacion pasa correctamente
      return null
    }
  }
}
