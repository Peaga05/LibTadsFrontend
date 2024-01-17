import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AutorDto, AutorServiceProxy, FlatPermissionDto, UpdateAutorDto, UserDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-autor',
  templateUrl: './edit-autor.component.html',
  styleUrls: ['./edit-autor.component.css']
})
export class EditAutorComponent extends AppComponentBase implements OnInit {
  saving = false;
  id: number;
  autor = new UpdateAutorDto();
  permissions: FlatPermissionDto[];
  grantedPermissionNames: string[];
  checkedPermissionsMap: { [key: string]: boolean } = {};
  @Output() onSave = new EventEmitter<any>();
  
  constructor(
    injector: Injector,
    private _autorService: AutorServiceProxy,
    public bsModalRef: BsModalRef
    ) {
    super(injector);
  }

  ngOnInit(): void {
    abp.ui.setBusy()
    this._autorService.getAutorById(this.id).pipe(
      finalize(() =>{
        abp.ui.clearBusy();
      })
    ).subscribe((autor) => {
      this.autor = autor;
    })
  }

  save(): void {
    this.saving = true;
    const autor = new UpdateAutorDto();
    autor.init(this.autor);

    this._autorService.update(autor).subscribe(
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
