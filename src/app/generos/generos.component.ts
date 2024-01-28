import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { GeneroDto, GeneroServiceProxy, GeneroDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { EditGeneroComponent } from './edit-genero/edit-genero.component';
import { CreateGeneroComponent } from './create-genero/create-genero.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';

class PagedGenerosRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  selector: 'app-generos',
  templateUrl: './generos.component.html',
  styleUrls: ['./generos.component.css'],
  animations: [appModuleAnimation()],
})
export class GenerosComponent extends PagedListingComponentBase<GeneroDto> {

  generos: GeneroDto[] = [];
  keyword: string = "";

  constructor(
    injector: Injector,
    private _generoService: GeneroServiceProxy,
    private _modalService: BsModalService,
  ) {
    super(injector);
  }

  protected list(request: PagedGenerosRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.keyword = this.keyword;
    this._generoService
      .getGenero(request.keyword, request.skipCount, request.maxResultCount, pageNumber, 7)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: GeneroDtoPagedResultDto) => {
        this.generos = result.items;
        this.showPaging(result, pageNumber);
        this.keyword = "";
      });
  }

  protected delete(genero: GeneroDto): void {
    abp.message.confirm(
      "Deseja mesmo apagar o autor: " + genero.descricao,
      undefined,
      (result: boolean) => {
        if (result) {
          this._generoService.deActivate(genero.id)
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

  createGenero(): void {
    this.showCreateOrEditGeneroDialog();
  }

  editGenero(genero: GeneroDto): void {
    this.showCreateOrEditGeneroDialog(genero.id);
  }

  showCreateOrEditGeneroDialog(id?: number): void {
    let createOrEditGeneroDialog: BsModalRef;
    if (!id) {
      createOrEditGeneroDialog = this._modalService.show(
        CreateGeneroComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditGeneroDialog = this._modalService.show(
        EditGeneroComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }
    createOrEditGeneroDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
}
