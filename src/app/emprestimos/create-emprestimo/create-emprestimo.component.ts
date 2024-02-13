import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateEmprestimoDto, EmprestimoServiceProxy, LivroDto, LivroServiceProxy, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-emprestimo',
  templateUrl: './create-emprestimo.component.html',
  styleUrls: ['./create-emprestimo.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateEmprestimoComponent extends AppComponentBase implements OnInit {

  idLivro: string;
  emprestimoDto: CreateEmprestimoDto = new CreateEmprestimoDto;
  livroDto: LivroDto;
  dataEmprestimo: string;
  dataDevolucao: string;

  constructor(
    injector: Injector,
    private _livroService: LivroServiceProxy,
    private _userService: UserServiceProxy,
    private _emprestimoService: EmprestimoServiceProxy,
    private route: ActivatedRoute
  ) {
    super(injector)
  }

  ngOnInit(): void {
    abp.ui.setBusy();
    this.route.params.subscribe(params => {
      this._livroService.getLivroById(params['id']).pipe(
        finalize(() => {
          abp.ui.clearBusy();
        })
      ).subscribe((livro) => {
        this.livroDto = livro;
        this.emprestimoDto.livroId = livro.id;
        this.dataEmprestimo = moment(Date.now()).format('DD/MM/YYYY')
        this.dataDevolucao = moment(Date.now()).add(15, 'days').format('DD/MM/YYYY');
      })
    });
  }

  save(){
    abp.ui.setBusy();
    this._emprestimoService.create(this.emprestimoDto).pipe(
      finalize(() =>{
        abp.ui.clearBusy();
      })
    ).subscribe(() => {

    })
  }
}
