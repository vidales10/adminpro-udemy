import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuario: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public _usuarioService: UsuarioService, public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion.subscribe(resp => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuario(this.desde)
    .subscribe((res: any) => {
      this.totalRegistros = res.total;
      this.usuario = res.usuarios;
      this.cargando = false;
    });
  }

  cambiardesde(valor: number) {
    let desde = this.desde + valor;
    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return; 
    }
    this.cargando = true;
    this._usuarioService.buscarUsuarios(termino)
    .subscribe((usuarios: Usuario[]) => {
      this.totalRegistros = usuarios.length;
      this.usuario = usuarios;
      this.cargando = false;
    });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this._usuarioService.usuario._id) {
      swal('No puede borrar usuario', 'No puede borrase a si mismo', 'error');
      return;
    }
    swal({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._usuarioService.borrarUsuario(usuario).subscribe((res: any) => {
          if (res) {
            swal('Usuario Borrado', 'Se borro el usuario ' + res.usuario.nombre, 'success');
            this.cargarUsuarios();
            return;
          }
        });
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario).subscribe();
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('usuarios', id);
  }
}
