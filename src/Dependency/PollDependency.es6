/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AbstractDependency from './AbstractDependency';

/**
 * Provides a dependency that fulfils when the supplied callback function returns a value different than the specified
 * falsyValue. Keep in mind that a === comparison is performed on the result, so beware if you intend to use instances
 * as falsy values.
 *
 * The callback is invoked once, immediately upon creation of the dependency and then polled continuously at the
 * specified interval (in milliseconds).
 *
 * The fulfilled value will be whatever the supplied callback returns that is different than the supplied falsy value.
 * The failure value will be any error thrown during creation of the supplied callback function.
 *
 * This can be useful when your dependency relies on the return value of a function you can afford to be called
 * numerous times. When possible, prefer PromiseDependency over this one for performance considerations.
 *
 * NOTE: The specified interval & limit of polls will be-recalculated to never exceed 20 seconds of total polling time.
 */
class PollDependency extends AbstractDependency {

    constructor( name, callback, falsyValue, interval = 1, limit = 20000 ) {

        interval = Math.min( interval, 20000 );

        let resolve,
            reject,
            polls = Math.round( Math.min( limit * interval, 20000 ) / interval );

        const poll = () => {

            try {

                const value = callback();
                if ( value === falsyValue ) {

                    if ( 0 < --polls ) {

                        setTimeout( poll, interval );

                    }

                    return;

                }

                resolve( value );

            } catch ( e ) {

                return reject( e );

            }

        };

        super( name, new Promise( ( _resolve, _reject ) => {

            resolve = _resolve;
            reject = _reject;

        } ) );

        poll();

    }

}

PollDependency.type = 'poll';

export default PollDependency;
