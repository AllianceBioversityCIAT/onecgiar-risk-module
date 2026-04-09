import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
  catchError,
  startWith,
} from 'rxjs/operators';
import { of } from 'rxjs';
import {
  ApiExploreService,
  ExploreProgram,
} from 'src/app/shared-services/explore-services/api-explore.service';
import { HeaderService } from 'src/app/header.service';

@Component({
  selector: 'app-explore-list',
  templateUrl: './explore-list.component.html',
  styleUrls: ['./explore-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  dataSource = new MatTableDataSource<ExploreProgram>([]);
  displayedColumns: string[] = [
    'official_code',
    'name',
    'total_actions',
    'avg_current',
    'avg_target',
    'risks_count',
    'actions',
  ];

  isLoading = false;
  hasError = false;

  constructor(
    private exploreService: ApiExploreService,
    private headerService: HeaderService,
    private router: Router,
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
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term) => {
          this.isLoading = true;
          this.hasError = false;
          this.cdr.markForCheck();
          return this.exploreService.getPrograms(term || '').pipe(
            catchError(() => {
              this.hasError = true;
              return of([]);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((programs) => {
        this.dataSource.data = programs;
        this.isLoading = false;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  viewProgram(official_code: string): void {
    this.router.navigate(['/explore', official_code]);
  }

  getRiskLevelClass(level: number): string {
    if (level <= 4) return 'level--green';
    if (level <= 9) return 'level--yellow';
    if (level <= 15) return 'level--orange';
    return 'level--red';
  }

  trackByCode(_index: number, program: ExploreProgram): string {
    return program.official_code;
  }
}
