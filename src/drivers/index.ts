/*
 Have to export them like this, due to the problem with prettier (https://github.com/prettier/prettier/issues/5097)
 If lint wasn't throwing the error, they'd be like this:

    export * as _arinpal from './zarinpal';
    export * as zibal from './zibal';
    ...etc
 */

import * as _zarinpal from './zarinpal';
import * as _zibal from './zibal';
import * as _saman from './saman';

export let zarinpal = _zarinpal;
export let zibal = _zibal;
export let saman = _saman;
