/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AbstractDependency from './AbstractDependency';

/**
 * Provides a dependency that can only be manually fulfilled or failed by calling the respective methods.
 *
 * The fulfilled value / failed error will be the first argument passed to fulfil() / fail().
 *
 * This can be useful when it's simpler to call dependency.fulfil() than creating a promise.
 */
export default class ManualDependency extends AbstractDependency {

    static type = 'manual';

    constructor( name ) {

        super( name );

    }

}
