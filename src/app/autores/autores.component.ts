import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateAutorComponent } from './create-autor/create-autor.component';
import { EditAutorComponent } from './edit-autor/edit-autor.component';
import { AutorDto, AutorDtoPagedResultDto, AutorServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

class PagedAutoresRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  selector: 'app-autores',
  templateUrl: './autores.component.html',
  styleUrls: ['./autores.component.css'],
  animations: [appModuleAnimation()]
})
export class AutoresComponent extends PagedListingComponentBase<AutorDto> {

  autores: AutorDto[] = [];
  keyword = '';

  constructor(   
    injector: Injector,
    private _modalService: BsModalService,
    private _autorService: AutorServiceProxy,
  ) { 
    super(injector);
  }
  list(request: PagedAutoresRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.keyword = this.keyword;
    this._autorService
      .getAutores(request.keyword, request.skipCount, request.maxResultCount, pageNumber, 7)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: AutorDtoPagedResultDto) => {
        this.autores = result.items;
        this.showPaging(result, pageNumber);
        this.keyword = "";
      });
  }

  delete(autor: AutorDto): void {
    abp.message.confirm(
      "Deseja mesmo apagar o autor: " + autor.nome,
      undefined,
      (result: boolean) => {
        if (result) {
          this._autorService.deActivate(autor.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyDeleted'));
                this.refresh();
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  createAutor(): void {
    this.showCreateOrEditAutorDialog();
  }

  editAutor(autor: AutorDto): void {
    this.showCreateOrEditAutorDialog(autor.id);
  }

  showCreateOrEditAutorDialog(id?: number): void {
    let createOrEditRoleDialog: BsModalRef;
    if (!id) {
      createOrEditRoleDialog = this._modalService.show(
        CreateAutorComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditRoleDialog = this._modalService.show(
        EditAutorComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }
    createOrEditRoleDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
}
