import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any {
    let url = URL_SERVICIOS + '/img';
    if (!img) {
      return url + '/usuarios/xxxx';
    }
    if (img.indexOf('https') >= 0) {
      return img;
    }
    switch (tipo) {
      case 'usuario':
          url += '/usuarios/' + img;
        break;
      case 'municipio':
          url += '/municipios/' + img;
      break;
      case 'lotes':
          url += '/lotes/' + img;
      break;
      default: console.log('Tipo de imagen no existe, usuario, municipio, lote');
      url += '/usuarios/xxxx';
    }
    return url;
  } 

}
