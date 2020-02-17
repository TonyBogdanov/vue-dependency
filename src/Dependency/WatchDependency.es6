/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AbstractDependency from './AbstractDependency';

/**
 * Provides a dependency that fulfils when a reactive property of the specified component becomes anything but the
 * specified falsyValue. Keep in mind that a === comparison is performed, so beware if you intend to use instances
 * as falsy values.
 *
 * The fulfilled value will be whatever the watched property's value is that is different than the supplied falsy value.
 * This dependency never fails, it can only hang as pending.
 *
 * This can be useful when your dependency relies on the value of a reactive property, even on foreign components.
 */
class WatchDependency extends AbstractDependency {

    constructor( name, component, property, falsyValue ) {

        super( name, new Promise( resolve => {

            const unwatch = component.$watch( property, value => {

                if ( falsyValue === value ) {

                    return;

                }

                Promise.resolve( unwatch );
                resolve( value );

            }, { immediate: true } );

        } ) );

    }

}

WatchDependency.type = 'watch';

export default WatchDependency;
