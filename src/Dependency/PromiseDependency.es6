/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AbstractDependency from './AbstractDependency';

/**
 * Provides a dependency that fulfils or fails when the supplied promise is resolved or rejected.
 *
 * The fulfilled value / failed error is resolved / rejected value respectively, of the supplied promise.
 *
 * This can be useful when your dependency relies on the success of a promise.
 */
export default class PromiseDependency extends AbstractDependency {

    static type = 'promise';

    constructor( name, promise ) {

        super( name, promise );

    }

}
