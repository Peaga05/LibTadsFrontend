import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { AutorDto, AutorServiceProxy, CreateLivroDto, GeneroDto, GeneroServiceProxy, LivroServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-livro',
  templateUrl: './create-livro.component.html',
  styleUrls: ['./create-livro.component.css'],
  animations: [appModuleAnimation()],
})
export class CreateLivroComponent extends AppComponentBase implements OnInit {

  saving = false;
  livro = new CreateLivroDto();
  erro = false;
  autores: AutorDto[] = [];
  generos: GeneroDto[] = [];

  @Output() onSave = new EventEmitter<any>();
  constructor(
    injector: Injector,
    private _livroService: LivroServiceProxy,
    private _autorService: AutorServiceProxy,
    private _generoService: GeneroServiceProxy,
    public bsModalRef: BsModalRef) {
    super(injector)
  }

   ngOnInit() {
    this.livro.quantidade = 1
    abp.ui.setBusy();
     this._autorService.getAllAutor().pipe(
      finalize(() => {
        abp.ui.clearBusy();
      })
    ).subscribe((autores) => {
      if (autores.length > 0) {
        this.autores.push(...autores);
        if (this.autores.length > 0)
          this.livro.autorId = this.autores[0].id
      }else{
        this.erro = true;
      }
    })

    abp.ui.setBusy();
     this._generoService.getAllGenero().pipe(
      finalize(() => {
        abp.ui.clearBusy();
      })
    ).subscribe((generos) => {
      if (generos.length > 0) {
        this.generos.push(...generos)
        if (this.generos.length > 0)
          this.livro.generoId = this.generos[0].id
      }else{
        this.erro = true;
      }
    })
  }

  save() {
    this.saving = true;
    const livro = new CreateLivroDto();

    livro.init(this.livro);

    this._livroService.create(livro).subscribe(() => {
      this.notify.info(this.l('SavedSuccessfully'));
      this.bsModalRef.hide();
      this.onSave.emit();
    },
      () => {
        this.saving = false;
      })
  }
}
