import {Component} from '@angular/core';
import {changeDetection} from '@demo/emulate/change-detection';
import {encapsulation} from '@demo/emulate/encapsulation';
import {TUI_DEFAULT_MATCHER, tuiPure} from '@taiga-ui/cdk';
import {combineLatest, merge, Observable, of, Subject} from 'rxjs';
import {map, share, startWith, switchMap, tap} from 'rxjs/operators';

import {default as avatar} from '!!file-loader!../../../../../assets/images/avatar.jpg';

class User {
    constructor(
        readonly firstName: string,
        readonly lastName: string,
        readonly phone: string,
        readonly avatarUrl: string | null = null,
        readonly disabled: boolean = false,
    ) {}

    toString(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}

const DATA: ReadonlyArray<User> = [
    new User(
        'Roman',
        'Sedov',
        '+75678901234',
        'http://marsibarsi.me/images/1x1small.jpg',
    ),
    new User('Alex', 'Inkin', '+75678901234', avatar),
];

@Component({
    selector: 'tui-input-phone-example-3',
    templateUrl: './index.html',
    styleUrls: ['./index.less'],
    changeDetection,
    encapsulation,
})
export class TuiInputPhoneExample3 {
    private readonly search$ = new Subject<string>();

    private readonly selected$ = new Subject<User>();

    value = '';

    readonly user$ = merge(
        this.selected$,
        this.search$.pipe(
            switchMap(value =>
                this.request(value).pipe(
                    map(response =>
                        this.isFullMatch(response, value) ? response[0] : null,
                    ),
                ),
            ),
        ),
    ).pipe(
        tap(user => {
            if (user) {
                this.value = user.phone;
            }
        }),
    );

    readonly items$ = this.search$.pipe(
        startWith(''),
        switchMap(value =>
            this.request(value).pipe(
                map(response => (this.isFullMatch(response, value) ? [] : response)),
            ),
        ),
    );

    readonly placeholder$ = combineLatest(this.user$, this.search$).pipe(
        map(([user, search]) => user || this.getPlaceholder(search)),
        startWith('Phone number or name'),
    );

    onSearch(search: string) {
        this.search$.next(search);
    }

    onClick(user: User) {
        this.selected$.next(user);
    }

    private getPlaceholder(search: string): string {
        if (!search) {
            return 'Phone number or name';
        }

        if (search.startsWith('+')) {
            return 'Phone number';
        }

        return 'Name';
    }

    private isFullMatch(response: ReadonlyArray<User>, value: string): boolean {
        return (
            response.length === 1 &&
            (String(response[0]) === value || response[0].phone === value)
        );
    }

    // Request imitation
    @tuiPure
    private request(query: string): Observable<ReadonlyArray<User>> {
        return of(
            DATA.filter(
                item =>
                    TUI_DEFAULT_MATCHER(item, query) ||
                    TUI_DEFAULT_MATCHER(item.phone, query),
            ),
        ).pipe(share());
    }
}
