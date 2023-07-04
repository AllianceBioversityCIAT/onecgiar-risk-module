import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { AnnouncementComponent } from './pages/admin/announcement/announcement.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { EmailsComponent } from './pages/admin/emails/emails.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { HomeComponent } from './pages/home/home.component';
import { InitiativeDetailsComponent } from './pages/initiative-details/initiative-details.component';
import { InitiativesComponent } from './pages/initiatives/initiatives.component';
import { TeamMembersComponent } from './pages/team-members/team-members.component';
import { VersionDetailsComponent } from './pages/version-details/version-details.component';
import { VersionsDashboardComponent } from './pages/versions-dashboard/versions-dashboard.component';
import { SettingComponent } from './pages/admin/setting/setting.component';
import { MitigationStatusComponent } from './pages/admin/mitigation-status/mitigation-status.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '',
      component: DashboardComponent,},
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'categories',
        component: CategoriesComponent,
      },
      {
        path: 'emails',
        component: EmailsComponent,
      },
      {
        path: 'announcement',
        component: AnnouncementComponent,
      },
      {
        path: 'Settings',
        component: SettingComponent,
      },
      {
        path: 'Mitigation-status',
        component: MitigationStatusComponent,
      },
    ],
  },
  {
    path: 'initiatives',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: InitiativesComponent,
        children: [
          {
            path: ':id/:initiativeId',
            component: InitiativeDetailsComponent,
            children: [
              {
                path: 'team-members',
                component: TeamMembersComponent,
              },
              {
                path: 'versions',
                component: VersionsDashboardComponent,
                children: [
                  {
                    path: ':versionId',
                    component: VersionDetailsComponent,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
