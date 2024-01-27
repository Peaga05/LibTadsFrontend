import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateGeneroDto, GeneroServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-genero',
  templateUrl: './create-genero.component.html',
  styleUrls: ['./create-genero.component.css']
})
export class CreateGeneroComponent extends AppComponentBase {
  saving = false;
  genero = new CreateGeneroDto();
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _generoService: GeneroServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  save(){
    this.saving = true;
    const genero = new CreateGeneroDto();

    genero.init(this.genero);

    this._generoService.create(genero).subscribe(() => {
      this.notify.info(this.l('SavedSuccessfully'));
      this.bsModalRef.hide();
      this.onSave.emit();
    },
    () => {
      this.saving = false;
    })
  }
}
