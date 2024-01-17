import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AutorDto, AutorServiceProxy, CreateAutorDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-autor',
  templateUrl: './create-autor.component.html',
  styleUrls: ['./create-autor.component.css']
})
export class CreateAutorComponent extends AppComponentBase implements OnInit {
  saving = false;
  autor = new CreateAutorDto();
  checkedPermissionsMap: { [key: string]: boolean } = {};

  @Output() onSave = new EventEmitter<any>();
  constructor(
    injector: Injector,
    private _autorService: AutorServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
   }

  ngOnInit(): void {}
  
  save(): void {
    this.saving = true;

    const autor = new CreateAutorDto();
    autor.init(this.autor);

    this._autorService
      .create(autor)
      .subscribe(
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
