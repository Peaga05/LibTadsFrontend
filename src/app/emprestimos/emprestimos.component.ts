import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { EmprestimoDto, EmprestimoDtoPagedResultDto, EmprestimoServiceProxy, LivroDto, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { result } from 'lodash-es';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

class PagedEmprestimoRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  selector: 'app-emprestimos',
  templateUrl: './emprestimos.component.html',
  styleUrls: ['./emprestimos.component.css'],
  animations: [appModuleAnimation()]
})
export class EmprestimosComponent extends PagedListingComponentBase<EmprestimoDto>{

  emprestimos: EmprestimoDto[] = [];
  roles: string[] = [];
  userId: number = 0;
  keyword: string = "";
  showButtons: boolean = false;

  constructor(
    injector: Injector,
    private _emprestimoService: EmprestimoServiceProxy,
    private _userService: UserServiceProxy
  ) {
    super(injector)
  }

  protected list(request: PagedEmprestimoRequestDto, pageNumber: number, finishedCallback: Function): void {
    
    if (this.roles.length == 0) {
      this.getUserRoles();
    }

    request.keyword = this.keyword;
    if (this.roles.includes("Aluno") && (!this.roles.includes("Admin") || !this.roles.includes("Secretario"))) {
      this._emprestimoService
        .getAllEmprestimosByUser(request.keyword, request.skipCount, request.maxResultCount, pageNumber, 7)
        .pipe(
          finalize(() => {
            finishedCallback();
          })
        )
        .subscribe((result: EmprestimoDtoPagedResultDto) => {
          this.emprestimos = result.items;
          this.showPaging(result, pageNumber);
          this.keyword = "";
        });

    } else if (this.roles.includes("Admin") || this.roles.includes("Secretario")) {
      this._emprestimoService
        .getAllEmprestimos(request.keyword, request.skipCount, request.maxResultCount, pageNumber, 7)
        .pipe(
          finalize(() => {
            finishedCallback();
          })
        )
        .subscribe((result: EmprestimoDtoPagedResultDto) => {
          this.emprestimos = result.items;
          this.showPaging(result, pageNumber);
          this.keyword = "";
        });
    }
  }

  protected delete(entity: EmprestimoDto): void {
    throw new Error('Method not implemented.');
  }

  getUserRoles(): void {
    abp.ui.setBusy();
    this._userService.getUserRoles().pipe(
      finalize(() => {
        abp.ui.clearBusy();
      })
    ).subscribe((roles) => {
      this.roles = roles;
      abp.ui.setBusy();
      this._userService.getUserLogado().pipe(
        finalize(() => {
          abp.ui.clearBusy();
        })
      ).subscribe((user: UserDto) => {
        this.userId = user.id;
        this.refresh();
      })
    })
  }

  devolver(emprestimo: EmprestimoDto) {
    abp.ui.setBusy();
    this._emprestimoService.devolverLivro(emprestimo.id).pipe(
      finalize(() => {
        abp.ui.clearBusy();
      })
    ).subscribe(() => {
      abp.notify.success("Livro devolvido com sucesso!");
      this.refresh();
    })
  }

  renovar(emprestimo: EmprestimoDto) {
    abp.message.confirm("Devolver até: " + moment(Date.now()).add(15, 'days').format('DD/MM/YYYY'), "Deseja mesmo renovar o empréstimo?", (result) => {
      if (result) {
        abp.ui.setBusy();
        this._emprestimoService.renovarEmprestimo(emprestimo.id).pipe(
          finalize(() => {
            abp.ui.clearBusy();
          })
        ).subscribe(() => {
          abp.notify.success("Empréstimo renovado com sucesso!");
          this.refresh();
        })
      }
    })
  }
}

