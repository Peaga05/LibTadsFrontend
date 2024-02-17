import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.component.html',
  styleUrls: ['./meu-perfil.component.css'],
  animations: [appModuleAnimation()]
})
export class MeuPerfilComponent extends AppComponentBase implements OnInit {
  user: UserDto;

  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    abp.ui.setBusy()
    this._userService.getUserLogado().pipe(
      finalize(() => {
        abp.ui.clearBusy();
      })
    ).subscribe((user) => {
      this.user = user;
    })
  }

  save() {
    abp.ui.setBusy;
    this._userService.update(this.user).pipe(
      finalize(() => {
        abp.ui.clearBusy();
      })
    ).subscribe((user) => {
      this.user = user;
      abp.notify.success("Dados atualizados com sucesso!");
    })
  }
}
