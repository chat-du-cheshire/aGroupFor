import {ViewRef} from '@angular/core';

import {AGroupForGroup} from './a-group-for-group';

export class AGroupForRow {
    public parent: AGroupForGroup;

    public view: ViewRef;

    constructor(public $implicit: any, public index: number, public count: number) { }

    get first(): boolean { return this.index === 0; }

    get last(): boolean { return this.index === this.count - 1; }

    get even(): boolean { return this.index % 2 === 0; }

    get odd(): boolean { return !this.even; }
}
