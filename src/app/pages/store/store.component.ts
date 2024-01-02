import { Component, Input, OnInit } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { ProductoService } from 'src/app/services/product.service';
import { Location } from '@angular/common';
import { Producto } from 'src/app/models/producto.model';
import { FavoritoService } from 'src/app/services/favorito.service';
import { Favorite } from 'src/app/models/favorite.model';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MessageService } from 'src/app/services/message.service';
              import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {

  @Input() categories: Categoria[] = [];
  public productos: Producto;
  public usuario: Usuario;
  public producto: Producto;
  favoriteItem: Favorite;
  public msm_success = false;

  constructor(
    public productService:ProductoService,
    private location: Location,
    public favoritoService: FavoritoService,
    public usuarioService: UsuarioService,
    private messageService: MessageService,
  ) {
    this.usuario = usuarioService.usuario;
   }

  ngOnInit(): void {
    this.closeMenu();
    this.getAllProducts();
  }

  getAllProducts(){
    this.productService.getProductosActivos().subscribe((resp:any)=>{
      console.log(resp);
      this.productos = resp;
    })
  }

  closeMenu(){
    var menuLateral = document.getElementsByClassName("sidemenu");
      for (var i = 0; i<menuLateral.length; i++) {
         menuLateral[i].classList.remove("active");

      }
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  addToFavorites(producto){
    
    this.producto = producto
    this.usuario.uid = this.usuario.uid
              
      const data = {
        producto: this.producto._id,
        usuario: this.usuario.uid,
      }
      
      this.favoritoService.registro(data ).subscribe((res:any)=>{
        this.favoriteItem = res;
        // console.log(this.favoriteItem);
        console.log('sending...', this.producto)
        // this.notificacion();
        
      });
    
  }

  addToFavoritoos(producto){debugger
    if(!this.favoritoService.existeEnFavoritos(producto)){
      const nuevoFavorito : Favorite= new Favorite(null)
      this.favoritoService.registro(nuevoFavorito).subscribe((resp:any)=>{})
          
    }else{
      this.removeFavorito(producto._id);
    }
    
  }

  removeFavorito(_id:string){
    this.favoritoService.eliminar(_id).subscribe(
      res=>{
        // console.log(res);
        this.ngOnInit();

      }
    );
  }


  addToCart(){debugger

    this.messageService.sendMessage(this.producto);
    console.log('sending item to cart...', this.producto)
    this.msm_success = true;
  }
  
}
