import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './header/header.component';
import { UserManagementComponent } from './Admin/admin-module/user-management/user-management.component';
import { UserFormDialogComponent } from './Admin/admin-module/user-management/user-form-dialog/user-form-dialog.component';
import { ApiUserService } from './shared-services/admin-services/User-Management-Services/api-user.service';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';
import { ParametersSettingsComponent } from './Admin/admin-module/parameters-settings/parameters-settings.component';
import { AdminModuleComponent } from './Admin/admin-module/admin-module.component';

import { MitigationStatusComponent } from './Admin/admin-module/mitigation-status/mitigation-status.component';
import { SettingsComponent } from './Admin/admin-module/parameters-settings/settings/settings.component';
import { ApiCategoryService } from './shared-services/admin-services/Parameters-settings-Services/api-category.service';

import { MitigationStatusFormDialogComponent } from './Admin/admin-module/mitigation-status/mitigation-status-form-dialog/mitigation-status-form-dialog.component';
import { AnnouncementsComponent } from './Admin/admin-module/announcements/announcements.component';
import { PostedComponent } from './Admin/admin-module/announcements/posted/posted.component';
import { DraftsComponent } from './Admin/admin-module/announcements/drafts/drafts.component';
import { AnnouncementsFormDialogComponent } from './Admin/admin-module/announcements/drafts/announcements-form-dialog/announcements-form-dialog.component';
import { ApiMitigationStatusService } from './shared-services/admin-services/Parameters-settings-Services/api-mitigation-status.service';
import { ApiAnnouncementService } from './shared-services/admin-services/Announcements-Services/api-announcement.service';
import { AboutRiskComponent } from './about-risk/about-risk.component';
import { FooterComponent } from './footer/footer.component';
import { GlossaryComponent } from './glossary/glossary.component';
import { ApiGlossaryService } from './shared-services/glossary-services/api-glossary.service';
import { FaqComponent } from './faq/faq.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RiskManagementComponent } from './home/risk-management/risk-management.component';
import { ApiRiskManagementService } from './shared-services/risk-management-services/api-risk-management.service';
import { RiskReportComponent } from './home/risk-management/risk-report/risk-report.component';
import { ApiRiskReportService } from './shared-services/risk-report-services/api-risk-report.service';
import { RiskReportFormComponent } from './home/risk-management/risk-report/risk-report-form/risk-report-form.component';
import { ApiActionsControlsService } from './shared-services/actions-controls-services/api-actions-controls.service';
import { ActionsControlsFormDialogComponent } from './home/risk-management/risk-report/risk-report-form/actions-controls-form-dialog/actions-controls-form-dialog.component';
import { SubmitRiskDialogComponent } from './home/risk-management/risk-report/submit-risk-dialog/submit-risk-dialog.component';
import { PublishedVersionsComponent } from './home/risk-management/risk-report/published-versions/published-versions.component';
import { AcceleratedBreedingVersionComponent } from './home/risk-management/risk-report/published-versions/accelerated-breeding-version/accelerated-breeding-version.component';
import { ApiPublishedService } from './shared-services/published-services/api-published.service';
import { TeamMembersComponent } from './home/risk-management/risk-report/team-members/team-members.component';
import { TeamMembersFormDialogComponent } from './home/risk-management/risk-report/team-members/team-members-form-dialog/team-members-form-dialog.component';
import { ApiTeamMembersService } from './shared-services/team-members-services/api-team-members.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Safe } from './pipes/safe';
import { ToastrModule } from 'ngx-toastr';
import { NgxEditorModule } from 'ngx-editor';
import { HighchartsChartModule } from 'highcharts-angular';
import { LoginComponent } from './login/login.component';
import { HeaderService } from './header.service';
import { CategoryComponent } from './Admin/admin-module/category/category.component';
import { CategoryFormDialogComponent } from './Admin/admin-module/category/category-form-dialog/category-form-dialog.component';
import { GlossaryAdminComponent } from './Admin/admin-module/glossary-admin/glossary-admin.component';
import { GlossaryFormDialogComponent } from './Admin/admin-module/glossary-admin/glossary-form-dialog/glossary-form-dialog.component';
import { FaqAdminComponent } from './Admin/admin-module/faq-admin/faq-admin.component';
import { FaqFormDialogComponent } from './Admin/admin-module/faq-admin/faq-form-dialog/faq-form-dialog.component';
import { PagenotfoundcomponentComponent } from './pagenotfoundcomponent/pagenotfoundcomponent.component';
import { SearchInitComponent } from './home/risk-management/search-init/search-init.component';
import { RiskManagementTableComponent } from './home/risk-management/risk-management-table/risk-management-table.component';
import { RiskReportTableComponent } from './home/risk-management/risk-report/risk-report-table/risk-report-table.component';
import { AppSocket } from './services/socket.service';
import { HttpRequestInterceptor } from './services/http-request-interceptor';
import { SearchRiskComponent } from './home/risk-management/risk-report/search-risk/search-risk.component';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { VersionsTableComponent } from './home/risk-management/risk-report/published-versions/versions-table/versions-table.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RiskDashboardComponent } from './home/risk-management/risk-report/risk-dashboard/risk-dashboard.component';
import { EmailsComponent } from './Admin/admin-module/emails/emails.component';
import { EmailBodyComponent } from './Admin/admin-module/emails/email-body/email-body.component';
import { AvatarModule, AvatarSource } from 'ngx-avatars';
import { RiskReportOverviewComponent } from './home/risk-management/risk-report/risk-report-overview/risk-report-overview.component';
import { AuthComponent } from './auth/auth.component';
import { SendTestComponent } from './Admin/admin-module/announcements/send-test/send-test.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PhasesComponent } from './Admin/admin-module/phases/phases.component';
import { PhaseDialogComponent } from './Admin/admin-module/phases/phase-dialog/phase-dialog.component';
const avatarSourcesOrder = [AvatarSource.INITIALS];
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserManagementComponent,
    UserFormDialogComponent,
    DeleteConfirmDialogComponent,
    ParametersSettingsComponent,
    AdminModuleComponent,
    PhasesComponent,
    MitigationStatusComponent,
    SettingsComponent,
    CategoryFormDialogComponent,
    MitigationStatusFormDialogComponent,
    AnnouncementsComponent,
    PostedComponent,
    DraftsComponent,
    AnnouncementsFormDialogComponent,
    AboutRiskComponent,
    FooterComponent,
    GlossaryComponent,
    FaqComponent,
    DashboardComponent,
    PhaseDialogComponent,
    RiskManagementComponent,
    RiskReportComponent,
    RiskReportFormComponent,
    ActionsControlsFormDialogComponent,
    SubmitRiskDialogComponent,
    PublishedVersionsComponent,
    AcceleratedBreedingVersionComponent,
    TeamMembersComponent,
    TeamMembersFormDialogComponent,
    Safe,
    LoginComponent,
    CategoryComponent,
    GlossaryAdminComponent,
    GlossaryFormDialogComponent,
    FaqAdminComponent,
    FaqFormDialogComponent,
    PagenotfoundcomponentComponent,
    SearchInitComponent,
    RiskManagementTableComponent,
    RiskReportTableComponent,
    SearchRiskComponent,
    VersionsTableComponent,
    RiskDashboardComponent,
    EmailsComponent,
    EmailBodyComponent,
    RiskReportOverviewComponent,
    AuthComponent,
    SendTestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxMatSelectSearchModule,
    ToastrModule.forRoot(),
    NgxEditorModule,
    HighchartsChartModule,
    SatPopoverModule,
    NgSelectModule,
    MatProgressBarModule,
    AvatarModule.forRoot({
      sourcePriorityOrder: avatarSourcesOrder,
    }),
  ],
  providers: [
    ApiUserService,
    ApiCategoryService,
    ApiMitigationStatusService,
    ApiAnnouncementService,
    ApiGlossaryService,
    ApiRiskManagementService,
    ApiRiskReportService,
    ApiActionsControlsService,
    ApiPublishedService,
    ApiTeamMembersService,
    HeaderService,
    AppSocket,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
