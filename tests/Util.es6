/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class Util {

    /**
     * Returns a promise that resolves after the specified delay (in ms) with the specified value (or whatever
     * setTimeout returns if value is undefined).
     *
     * @param delay
     * @param value
     * @returns {Promise<unknown>}
     */
    static sleep( delay, value ) {

        return new Promise( resolve => setTimeout( 'undefined' === typeof value ?
            resolve : () => resolve( value ), delay ) );

    }

}
