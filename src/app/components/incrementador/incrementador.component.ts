import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress') txtProgress: ElementRef;
  @Input('nombre') leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  @Output() cambioValor: EventEmitter<number> = new EventEmitter();
  
  constructor() { 
    
  }

  ngOnInit() {
    
  }

  onChange(newValue: number) {
    // let elemHtml: any = document.getElementsByName('progreso')[0];
    if ( newValue >= 100 ) {
      this.progreso = 100;
      newValue = 100;
    } else if (newValue <= 0) {
      this.progreso = 0;
      newValue = 0;
    } else {
      this.progreso = newValue;
    }
    // elemHtml.value = this.progreso;
    this.txtProgress.nativeElement.value = this.progreso;
    this.cambioValor.emit( this.progreso );
  }

  cambiarValor(valor: number) {
    
    this.progreso = this.progreso + valor;
    if ( this.progreso <= 0) {
      this.progreso = 0;
    }
    if ( this.progreso >= 100) {
      this.progreso = 100;
    }
    this.cambioValor.emit( this.progreso );
    this.txtProgress.nativeElement.focus();
  }

}
