import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(public http: HttpClient, public router: Router, public _subirArchivoService: SubirArchivoService) { 
    this.cargarStorage();
  }

  estaLogueado() {
    return this.token.length > 5 ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  login(usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    let url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario)
    .map((res: any) => {
      this.guardarStorage(res.id, res.token, res.usuario);
      return true;
    });
  }

  logout() {
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
     let url = URL_SERVICIOS + '/login/google';
     return this.http.post(url, {token}).map((res: any) => {
        this.guardarStorage(res.id, res.token, res.usuario);
        return true;
     });
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      this.usuario = usuario;
      this.token = token;
  }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario)
           .map((resp: any) => {
             swal('Usuario creado', usuario.email, 'success');
             return resp.usuario;
           });
  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id + '?token=' + this.token;
    return this.http.put(url, usuario)
    .map((res: any) => {
      if (usuario._id === this.usuario._id) {
        let usuarioDB = res.usuario;
        this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
      }
      swal('Usuario actualizado', usuario.nombre, 'success');
      return true;
    });
  }

  cambiarImagen(file: File, id: string) {
    this._subirArchivoService.subirArchivo(file, 'usuarios' , id)
    .then((res: any) => {
      this.usuario.img = res.usuario.img;
      swal('Imagen actualizada', this.usuario.nombre, 'success');
      this.guardarStorage(id, this.token, this.usuario);
    })
    .catch(res => {
      console.log(res);
    });
  }

  cargarUsuario(desde: number) {
    let url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this.http.get(url); 
  }

  buscarUsuarios(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/usuario/' + termino;
    return this.http.get(url).map((res: any) => res.usuario);
  }

  borrarUsuario(usuario: Usuario) {
    
    let url = URL_SERVICIOS + '/usuario/' + usuario._id + '?token=' + this.token;
    return this.http.delete(url);
  }
}
