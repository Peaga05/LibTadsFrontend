import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AutorDto, AutorServiceProxy, GeneroDto, GeneroServiceProxy, LivroServiceProxy, UpdateLivroDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-livro',
  templateUrl: './edit-livro.component.html',
  styleUrls: ['./edit-livro.component.css']
})
export class EditLivroComponent extends AppComponentBase implements OnInit {
  id: number;
  saving = false;
  livro = new UpdateLivroDto();
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

  ngOnInit(): void {
    abp.ui.setBusy();
     this._autorService.getAllAutor().pipe(
      finalize(() => {
        abp.ui.clearBusy();
      })
    ).subscribe((autores) => {
        this.autores.push(...autores);
    })

    abp.ui.setBusy();
     this._generoService.getAllGenero().pipe(
      finalize(() => {
        abp.ui.clearBusy();
      })
    ).subscribe((generos) => {
        this.generos.push(...generos)
    });

    abp.ui.setBusy();
    this._livroService.getLivroById(this.id).pipe(
      finalize(() =>{
        abp.ui.clearBusy();
      })
    ).subscribe((livro) => {
      this.livro = livro
    })
  }

  save(){
    this.saving = true;
    const livro = new UpdateLivroDto();
    livro.init(this.livro);
    this._livroService.update(livro).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }

}
