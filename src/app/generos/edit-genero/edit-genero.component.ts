import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UpdateGeneroDto, GeneroServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-genero',
  templateUrl: './edit-genero.component.html',
  styleUrls: ['./edit-genero.component.css']
})
export class EditGeneroComponent extends AppComponentBase implements OnInit {
  saving = false;
  id: number;
  genero = new UpdateGeneroDto();
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _generoService: GeneroServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    abp.ui.setBusy();
    this._generoService.getAutorById(this.id).pipe(
      finalize(() => {
        abp.ui.clearBusy();
      })
    ).subscribe((genero) => {
      this.genero = genero;
    },
    )
  }

  save(){
    this.saving = true;
    const genero = new UpdateGeneroDto();
    genero.init(this.genero);

    this._generoService.update(genero).subscribe(
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
