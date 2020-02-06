/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AbstractDependency from './AbstractDependency';

/**
 * Provides a dependency that fulfils when all of the supplied dependencies fulfil, or fails when any of the supplied
 * dependencies fail. Only the very first failure will be tracked, further ones will be ignored.
 *
 * The fulfilled value will be an array of all fulfilment values of the supplied dependencies in the same order.
 * The failure value will be the failure value of the first failed dependency.
 *
 * This can be useful when you have multiple dependencies and you need for all of them to be fulfilled.
 */
class AllDependency extends AbstractDependency {

    constructor( name, ...dependencies ) {

        super( name, Promise.all( dependencies.map( dependency => dependency.promise ) ).then(

            dependencies => dependencies.map( dependency => dependency.value ),
            dependency => { throw dependency.value; }

        ) );

    }

}

AllDependency.type = 'all';

export default AllDependency;
