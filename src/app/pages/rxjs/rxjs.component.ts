import { Component, OnInit, OnDestroy } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() { 
    this.subscription = this.regresaObservable()
      .subscribe( 
      numero => console.log('Subs: ', numero),
      error => console.error('Error en el obs (2 veces)', error),
      () => console.log('El observador termino')
    );

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();    
  }

  regresaObservable(): Observable<any> {
    return new Observable( observer => {
      let contador = 0;
      let intervalo = setInterval (() => {
        contador += 1;
        let salida = {
          valor: contador
        };
        observer.next(salida);
        // if (3 === contador) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }

        // if (2 === contador) {
        //   observer.error('Auxilio!!!');
        // }
      }, 500);
    })
    .retry(2)
    .map((resp: any) => {
        return resp.valor;
    })
    .filter((valor, index) => {
      if ( (valor % 2) === 1 ) {
        return true;
      }
      // console.log('filter', valor, index);
      return false;
    });
  }

}
