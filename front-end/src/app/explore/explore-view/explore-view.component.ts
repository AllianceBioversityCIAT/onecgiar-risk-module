import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as Highcharts from 'highcharts';
import {
  ApiExploreService,
  ExploreProgramDetail,
  ExploreRisk,
} from 'src/app/shared-services/explore-services/api-explore.service';
import { HeaderService } from 'src/app/header.service';

@Component({
  selector: 'app-explore-view',
  templateUrl: './explore-view.component.html',
  styleUrls: ['./explore-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreViewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  program: ExploreProgramDetail | null = null;
  isLoading = true;
  hasError = false;
  errorMessage = '';

  // Chart data
  Highcharts = Highcharts;
  categoryChartOptions: Highcharts.Options = {};
  actionsChartOptions: Highcharts.Options = {};
  categoryData: { name: string; count: number }[] = [];
  avgCurrentLevel = 0;
  avgTargetLevel = 0;
  totalActions = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exploreService: ApiExploreService,
    private headerService: HeaderService,
    private cdr: ChangeDetectorRef
  ) {
    this.headerService.background =
      'linear-gradient(to right, #0F212F, #0E1E2B)';
    this.headerService.backgroundNavMain =
      'linear-gradient(to right, #436280, #30455B)';
    this.headerService.backgroundUserNavButton =
      'linear-gradient(to right, #436280, #30455B)';
  }

  ngOnInit(): void {
    const official_code = this.route.snapshot.paramMap.get('official_code');
    const version_id = this.route.snapshot.paramMap.get('version_id');
    if (!official_code) {
      this.router.navigate(['/explore']);
      return;
    }

    this.exploreService
      .getProgramByCode(official_code, version_id || undefined)
      .pipe(
        catchError((err) => {
          this.hasError = true;
          this.errorMessage =
            err?.status === 404
              ? 'Program not found or has no published submissions.'
              : 'Unable to load program data. Please try again later.';
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.program = data;
        if (data?.risks?.length) {
          this.computeChartData(data.risks);
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private computeChartData(risks: ExploreRisk[]): void {
    // Category distribution
    const catMap = new Map<string, number>();
    risks.forEach((r) => {
      const cat = r.category?.title || 'Uncategorized';
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });
    this.categoryData = Array.from(catMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Pie chart options
    this.categoryChartOptions = {
      chart: { type: 'pie', height: 280, backgroundColor: 'transparent' },
      title: { text: undefined },
      credits: { enabled: false },
      tooltip: {
        style: { fontSize: '14px', fontFamily: 'Poppins, sans-serif' },
        pointFormat: '<b>{point.y}</b> risk(s) ({point.percentage:.1f}%)',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}',
            style: { fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: '500' },
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Risks',
          data: this.categoryData.map((c) => ({
            name: c.name,
            y: c.count,
          })),
        },
      ],
    };

    // Mitigation status distribution
    const statusMap = new Map<string, number>();
    risks.forEach((r) => {
      r.mitigations?.forEach((m) => {
        const status = m.status?.title || 'No Status';
        statusMap.set(status, (statusMap.get(status) || 0) + 1);
      });
    });
    const actionsData = Array.from(statusMap.entries())
      .map(([name, count]) => ({ name, y: count }))
      .sort((a, b) => b.y - a.y);

    this.actionsChartOptions = {
      chart: { type: 'pie', height: 280, backgroundColor: 'transparent' },
      title: { text: undefined },
      credits: { enabled: false },
      tooltip: {
        style: { fontSize: '14px', fontFamily: 'Poppins, sans-serif' },
        pointFormat: '<b>{point.y}</b> action(s) ({point.percentage:.1f}%)',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}',
            style: { fontSize: '12px', fontFamily: 'Poppins, sans-serif', fontWeight: '500' },
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Actions',
          data: actionsData,
        },
      ],
    };

    // Total actions count
    this.totalActions = risks.reduce(
      (sum, r) => sum + (r.mitigations?.length || 0),
      0
    );

    // Averages
    this.avgCurrentLevel =
      Math.round(
        risks.reduce(
          (sum, r) =>
            sum + this.getRiskLevel(r.current_likelihood, r.current_impact),
          0
        ) / risks.length
      );
    this.avgTargetLevel =
      Math.round(
        risks.reduce(
          (sum, r) =>
            sum + this.getRiskLevel(r.target_likelihood, r.target_impact),
          0
        ) / risks.length
      );

  }

  goBack(): void {
    this.router.navigate(['/explore']);
  }

  getRiskLevel(likelihood: number, impact: number): number {
    return (likelihood || 0) * (impact || 0);
  }

  getRiskLevelClass(level: number): string {
    if (level <= 4) return 'level--green';
    if (level <= 9) return 'level--yellow';
    if (level <= 15) return 'level--orange';
    return 'level--red';
  }

  get teamLeads(): any[] {
    return (
      this.program?.roles?.filter(
        (r) =>
          r.role?.toLowerCase() === 'leader' ||
          r.role?.toLowerCase() === 'lead'
      ) || []
    );
  }

  get teamMembers(): any[] {
    return (
      this.program?.roles?.filter(
        (r) =>
          r.role?.toLowerCase() !== 'leader' &&
          r.role?.toLowerCase() !== 'lead'
      ) || []
    );
  }

  trackByRiskId(_index: number, risk: ExploreRisk): number {
    return risk.id;
  }

  trackByMitigationId(_index: number, m: any): number {
    return m.id;
  }

  trackByRoleId(_index: number, r: any): number {
    return r.id;
  }
}
