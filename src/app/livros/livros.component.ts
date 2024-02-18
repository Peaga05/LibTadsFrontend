import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { Livro, LivroDto, LivroDtoPagedResultDto, LivroServiceProxy, RoleDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateLivroComponent } from './create-livro/create-livro.component';
import { EditLivroComponent } from './edit-livro/edit-livro.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

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
  roles: string[] = [];
  keyword: string = "";
  showButtons: boolean = false;

  constructor(
    injector: Injector,
    private _livroService: LivroServiceProxy,
    private _userService: UserServiceProxy,
    private _modalService: BsModalService,
    private router: Router
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
        this.getUserRoles();
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
            .subscribe(() => { });
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
      abp.notify.success("Operação realizada com sucesso!");
      this.refresh();
    });
  }

  getUserRoles(): void {
    abp.ui.setBusy();
    this._userService.getUserRoles().pipe(
      finalize(() => {
        abp.ui.clearBusy();
      })
    ).subscribe((roles) => {
      this.roles = roles;
      if (this.roles.includes("Aluno")) {
        this.showButtons = false
      } else if (this.roles.includes("Admin") || this.roles.includes("Secretario")) {
        this.showButtons = true
      }
    })
  }

  async gerarQrCode(livro: LivroDto) {
    if (livro.qrCode != null) {
      await this.generateQRCodePDF(livro.qrCode);
    } else {
      abp.ui.setBusy();
      this._livroService.cadastrarQrCode(livro.id).pipe(
        finalize(() => {
          abp.ui.clearBusy();
        })
      ).subscribe(async (x) => {
        await this.generateQRCodePDF(x);
      })
    }
  }

  async generateQRCodePDF(qrCode: string): Promise<void> {
    const qrCodeImageUrl = 'data:image/png;base64,' + qrCode;
    const a = document.createElement('a');
    a.href = qrCodeImageUrl;
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
