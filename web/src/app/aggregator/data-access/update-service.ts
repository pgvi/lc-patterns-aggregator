import { inject, Injectable, signal } from '@angular/core';
import dayjs from 'dayjs';
import { combineLatest, finalize, mergeMap, of, shareReplay, tap } from 'rxjs';
import { UpdateState } from '../types/state';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AggregateResponse } from '../types/response';
import { UpdateDatesResponse } from '../types/response';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private readonly problemsURL = environment.problemsURL;
  private readonly updatesURL = environment.updatesURL;
  private readonly dateFormat = 'YYYY-MM-DD';
  private readonly lastCheckKey = 'lastCheck';
  private readonly lastUpdateKey = 'lastUpdate';
  private readonly lastCompaniesUpdateKey = 'lastCompaniesUpdate';
  private readonly unixStart = '1970-01-01';

  private readonly initialState = {
    isLoading: false,
    error: null,
    data: null,
    done: false,
  };
  private updateState$ = signal<UpdateState>(this.initialState);
  updateState = this.updateState$.asReadonly();

  http = inject(HttpClient);

  checkUpdate() {
    const isUpdateCheckRequired = this.isUpdateCheckRequired();
    if (isUpdateCheckRequired) this.checkUpdateDates();
    else
      this.updateState$.update((u) => {
        return { ...u, done: true };
      });
  }

  private checkUpdateDates() {
    this.updateState$.set({ ...this.initialState, isLoading: true });

    this.http
      .get<UpdateDatesResponse>(this.updatesURL, { cache: 'no-cache' })
      .pipe(
        mergeMap((updateDates) => {
          return this.isUpdateRequired(updateDates.lastUpdate)
            ? combineLatest([
                of(updateDates),
                this.http.get<AggregateResponse>(this.problemsURL, {
                  cache: 'no-cache',
                }),
              ])
            : combineLatest([of(updateDates), of(null)]);
        }),
        shareReplay(1),
        tap({
          next: ([dates, _]) => this.updateLocalStorageDates(dates),
          error: () => this.resetLocalStorageDatesCheck(),
        }),
        finalize(() =>
          this.updateState$.update((u) => {
            return { ...u, done: true };
          }),
        ),
      )
      .subscribe({
        next: ([_, aggregateResponse]) => {
          this.updateState$.set({
            ...this.initialState,
            data: aggregateResponse,
          });
        },
        error: (error: HttpErrorResponse) => {
          this.updateState$.set({
            ...this.initialState,
            error: error,
          });
        },
      });
  }

  private isUpdateCheckRequired() {
    const today = dayjs();

    let lastCheck = dayjs(
      localStorage.getItem(this.lastCheckKey) ?? this.unixStart,
      this.dateFormat,
    );
    if (!lastCheck.isValid())
      lastCheck = dayjs(this.unixStart, this.dateFormat);

    return lastCheck.isBefore(today, 'day');
  }

  private isUpdateRequired(lastUpdateAvailable: string): boolean {
    let lastUpdate = dayjs(
      localStorage.getItem(this.lastUpdateKey) ?? this.unixStart,
      this.dateFormat,
    );
    if (!lastUpdate.isValid())
      lastUpdate = dayjs(this.unixStart, this.dateFormat);

    let lastAvailable = dayjs(lastUpdateAvailable, this.dateFormat);
    if (!lastAvailable.isValid()) return true;

    return lastUpdate.isBefore(lastAvailable, 'day');
  }

  private updateLocalStorageDates(dates: UpdateDatesResponse) {
    localStorage.setItem(this.lastCheckKey, dayjs().format(this.dateFormat));
    localStorage.setItem(this.lastUpdateKey, dates.lastUpdate);
    localStorage.setItem(
      this.lastCompaniesUpdateKey,
      dates.lastCompaniesUpdate,
    );
  }

  private resetLocalStorageDatesCheck() {
    localStorage.setItem(this.lastCheckKey, this.unixStart);
  }
}
