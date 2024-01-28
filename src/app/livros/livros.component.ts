import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { LivroDto, LivroDtoPagedResultDto, LivroServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateLivroComponent } from './create-livro/create-livro.component';
import { EditLivroComponent } from './edit-livro/edit-livro.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';

class PagedLivrosRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  selector: 'app-livros',
  templateUrl: './livros.component.html',
  styleUrls: ['./livros.component.css'],
  animations: [appModuleAnimation()],
})
export class LivrosComponent extends PagedListingComponentBase<LivroDto>{

  livros: LivroDto[] = [];
  keyword: string = "";

  constructor(
    injector: Injector,
    private _livroService: LivroServiceProxy,
    private _modalService: BsModalService,
    ) { 
      super(injector);
    }
    
    protected list(request: PagedLivrosRequestDto, pageNumber: number, finishedCallback: Function): void {
      request.keyword = this.keyword;
    this._livroService
      .getLivros(request.keyword, request.skipCount, request.maxResultCount, pageNumber, 7)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: LivroDtoPagedResultDto) => {
        this.livros = result.items;
        this.showPaging(result, pageNumber);
        this.keyword = "";
      });
    }

    protected delete(livro: LivroDto): void {
      abp.message.confirm(
        "Deseja mesmo apagar o autor: " + livro.titulo,
        undefined,
        (result: boolean) => {
          if (result) {
            this._livroService.deActivate(livro.id)
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
  
    createLivro(): void {
      this.showCreateOrEditlivroDialog();
    }
  
    editLivro(livro: LivroDto): void {
      this.showCreateOrEditlivroDialog(livro.id);
    }
  
    showCreateOrEditlivroDialog(id?: number): void {
      let createOrEditLivroDialog: BsModalRef;
      if (!id) {
        createOrEditLivroDialog = this._modalService.show(
          CreateLivroComponent,
          {
            class: 'modal-lg',
          }
        );
      } else {
        createOrEditLivroDialog = this._modalService.show(
          EditLivroComponent,
          {
            class: 'modal-lg',
            initialState: {
              id: id,
            },
          }
        );
      }
      createOrEditLivroDialog.content.onSave.subscribe(() => {
        this.refresh();
      });
    }
}
