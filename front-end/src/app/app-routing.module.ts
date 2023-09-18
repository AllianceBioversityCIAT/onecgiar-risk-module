import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './Admin/admin-module/user-management/user-management.component';
import { ParametersSettingsComponent } from './Admin/admin-module/parameters-settings/parameters-settings.component';
import { AdminModuleComponent } from './Admin/admin-module/admin-module.component';

import { MitigationStatusComponent } from './Admin/admin-module/mitigation-status/mitigation-status.component';
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
import { CategoryComponent } from './Admin/admin-module/category/category.component';
import { GlossaryAdminComponent } from './Admin/admin-module/glossary-admin/glossary-admin.component';
import { FaqAdminComponent } from './Admin/admin-module/faq-admin/faq-admin.component';
import { PagenotfoundcomponentComponent } from './pagenotfoundcomponent/pagenotfoundcomponent.component';
import { RiskManagementTableComponent } from './home/risk-management/risk-management-table/risk-management-table.component';
import { VersionsTableComponent } from './home/risk-management/risk-report/published-versions/versions-table/versions-table.component';
import { RiskDashboardComponent } from './home/risk-management/risk-report/risk-dashboard/risk-dashboard.component';
import { EmailsComponent } from './Admin/admin-module/emails/emails.component';
import { RiskReportOverviewComponent } from './home/risk-management/risk-report/risk-report-overview/risk-report-overview.component';
import { AuthComponent } from './auth/auth.component';
import { PhasesComponent } from './Admin/admin-module/phases/phases.component';
import { LicenseComponent } from './footer/license/license.component';

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
            redirectTo: 'settings',
            pathMatch: 'full',
          },

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
      { path: 'category', component: CategoryComponent },
      { path: 'mitigation-status', component: MitigationStatusComponent },
      { path: 'glossary', component: GlossaryAdminComponent },
      { path: 'faq', component: FaqAdminComponent },
      { path: 'emails', component: EmailsComponent },
      { path: 'phases', component: PhasesComponent },
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
              {
                path: '',
                component: RiskReportOverviewComponent,
              },
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
              {
                path: 'versions',
                component: PublishedVersionsComponent,
                children: [
                  {
                    path: '',
                    component: VersionsTableComponent,
                  },
                  {
                    path: ':versionId',
                    component: AcceleratedBreedingVersionComponent,
                    data: {
                      title: 'AcceleratedBreedingVersionComponent',
                      description: 'AcceleratedBreedingVersionComponent',
                    },
                  },
                ],
              },
              {
                path: 'risk-dashboard',
                component: RiskDashboardComponent,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'auth', component: AuthComponent },
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
    canActivate: [AdminGuard],
    component: DashboardComponent,
  },
  {
    path: 'license',
    component: LicenseComponent,
  },

  { path: '404', component: PagenotfoundcomponentComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
