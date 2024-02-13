import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { AutoresComponent } from './autores/autores.component';
import { GenerosComponent } from './generos/generos.component';
import { LivrosComponent } from './livros/livros.component';
import { EmprestimosComponent } from './emprestimos/emprestimos.component';
import { CreateEmprestimoComponent } from './emprestimos/create-emprestimo/create-emprestimo.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    { path: 'home', component: HomeComponent, canActivate: [AppRouteGuard] },
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
                    { path: 'autores', component: AutoresComponent, data: { permission: 'Pages.Autores' }, canActivate: [AppRouteGuard] },
                    { path: 'generos', component: GenerosComponent, data: { permission: 'Pages.Generos' }, canActivate: [AppRouteGuard] },
                    { path: 'livros', component: LivrosComponent, data: { permission: 'Pages.Livros' }, canActivate: [AppRouteGuard] },
                    {
                        path: 'emprestimos',
                        component: EmprestimosComponent,
                        data: { permission: 'Pages.Emprestimos' },
                        canActivate: [AppRouteGuard],
                    },
                    {
                        path: 'emprestimos/create-emprestimo/:id',
                        component: CreateEmprestimoComponent,
                        data: { permission: 'Pages.Emprestimos' },
                        canActivate: [AppRouteGuard]
                    },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
                    { path: 'about', component: AboutComponent, canActivate: [AppRouteGuard] },
                    { path: 'update-password', component: ChangePasswordComponent, canActivate: [AppRouteGuard] }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
