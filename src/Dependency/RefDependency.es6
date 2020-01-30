/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import isArray from 'data-types-js/src/is/isArray';

import AbstractDependency from './AbstractDependency';
import PollDependency from './PollDependency';

/**
 * Provides a dependency that fulfils when an element with the specified reference becomes available under $refs of the
 * specified component.
 *
 * The fulfilled value will be the element component.$refs[ name ] is pointing to.
 * This dependency never fails, it can only hang as pending.
 *
 * This can be useful when your component depends on a child component being stamped in the view. For synchronous
 * children it's much better to use the TickDependency, but for asynchronous children that would not be sufficient.
 *
 * Keep in mind that reference presence does not equal child component ready-ness, as that component (after being
 * loaded) may have it's own internal dependencies. To ensure the child is both present and ready / registered, use
 * ComponentDependency instead.
 */
export default class RefDependency extends AbstractDependency {

    static type = 'ref';

    constructor( name, component, ref, pollInterval = 1, pollLimit = 20000 ) {

        super( name, new PollDependency( name, () => {

            if ( ! component.$refs.hasOwnProperty( ref ) ) {

                return false;

            }

            const element = component.$refs[ ref ];
            return isArray( element ) ? element[0] : element; // $refs cans be an array when in v-for.

        }, false, pollInterval, pollLimit ).promise );

    }

}
