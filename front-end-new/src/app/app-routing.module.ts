import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './Admin/admin-module/user-management/user-management.component';
import { UserFormDialogComponent } from './Admin/admin-module/user-management/user-form-dialog/user-form-dialog.component';
import { ParametersSettingsComponent } from './Admin/admin-module/parameters-settings/parameters-settings.component';
import { AdminModuleComponent } from './Admin/admin-module/admin-module.component';
import { CategoriesComponent } from './Admin/admin-module/parameters-settings/categories/categories.component';
import { MitigationStatusComponent } from './Admin/admin-module/parameters-settings/mitigation-status/mitigation-status.component';
import { SettingsComponent } from './Admin/admin-module/parameters-settings/settings/settings.component';
import { AnnouncementsComponent } from './Admin/admin-module/announcements/announcements.component';
import { PostedComponent } from './Admin/admin-module/announcements/posted/posted.component';
import { DraftsComponent } from './Admin/admin-module/announcements/drafts/drafts.component';
import { AboutRiskComponent } from './about-risk/about-risk.component';
import { GlossaryComponent } from './glossary/glossary.component';
import { FaqComponent } from './faq/faq.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { HomeComponent } from './home/home.component';
import { RiskManagementComponent } from './home/risk-management/risk-management.component';
import { RiskReportComponent } from './home/risk-management/risk-report/risk-report.component';
import { RiskReportFormComponent } from './home/risk-management/risk-report/risk-report-form/risk-report-form.component';
import { PublishedVersionsComponent } from './home/risk-management/risk-report/published-versions/published-versions.component';
import { AcceleratedBreedingVersionComponent } from './home/risk-management/risk-report/published-versions/accelerated-breeding-version/accelerated-breeding-version.component';
import { TeamMembersComponent } from './home/risk-management/risk-report/team-members/team-members.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { RiskManagementTableComponent } from './home/risk-management/risk-management-table/risk-management-table.component';
import { RiskReportTableComponent } from './home/risk-management/risk-report/risk-report-table/risk-report-table.component';

const routes: Routes = [
  // { path: 'admin', redirectTo: '/admin/user-management', pathMatch: 'full' },

  {
    path: 'admin',
    component: AdminModuleComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'user-management',
        pathMatch: 'full',
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
      },
      {
        path: 'parameters-settings',
        component: ParametersSettingsComponent,
        children: [
          {
            path: '',
            redirectTo: 'categories',
            pathMatch: 'full',
          },
          { path: 'categories', component: CategoriesComponent },
          { path: 'mitigation-status', component: MitigationStatusComponent },
          { path: 'settings', component: SettingsComponent },
        ],
      },
      {
        path: 'announcements',
        component: AnnouncementsComponent,
        children: [
          {
            path: '',
            redirectTo: 'posted',
            pathMatch: 'full',
          },
          { path: 'posted', component: PostedComponent },
          { path: 'drafts', component: DraftsComponent },
        ],
      },
    ],
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: RiskManagementComponent,
        children: [
          {
            path: '',
            component: RiskManagementTableComponent,
          },
          {
            path: ':id/:initiativeId',
            component: RiskReportComponent,
            children: [
              // {
              //   path: '',
              //   component: RiskReportTableComponent,
              // },
              {
                path: 'create-risk',
                component: RiskReportFormComponent,
              },
              {
                path: 'edit-risk/:riskId',
                component: RiskReportFormComponent,
              },
              {
                path: 'team-members',
                component: TeamMembersComponent,
              },
              // {
              //   path: 'submitted-versions',
              //   component: PublishedVersionsComponent,
              //   children: [
              //     {

              //     }
              //   ]
              // },
              // {
              //   path: 'risk-dashboard',
              //   component: 
              // }
            ]
          }
        ]
      },
      // {

      //   children: [
      //     {
      //       path: 'risk-report-form',
      //       component: RiskReportFormComponent,
      //     }
      //   ],
      // }
    ]
  },
  // {
  //   path: 'home',
  //   component: HomeComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: 'risk-management',
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: 'risk-management',
  //       component: RiskManagementComponent,
  //       children: [
  //         {
  //           path: 'risk-report',
  //           component: RiskReportComponent,
  //           children: [
  //             {
  //               path: 'risk-report-form',
  //               component: RiskReportFormComponent,
  //               children: [
  //                 {
  //                   path: 'risk-report-form/:id',
  //                   component: RiskReportFormComponent,
  //                 },
  //               ],
  //             },

  //             {
  //               path: 'submitted-versions',
  //               component: PublishedVersionsComponent,
  //               children: [
  //                 {
  //                   path: 'accelerated-breeding-version',
  //                   component: AcceleratedBreedingVersionComponent,
  //                 },
  //               ],
  //             },
  //             { path: 'team-members', component: TeamMembersComponent },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full',
  },
  { path: 'about', component: AboutRiskComponent },
  {
    path: 'glossary',
    component: GlossaryComponent,
  },
  {
    path: 'faq',
    component: FaqComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  //if path dose not exist
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
