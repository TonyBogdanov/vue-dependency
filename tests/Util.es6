/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import TickDependency from '../src/Dependency/TickDependency';

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

    /**
     * Returns a promise that resolves at the next browser frame with the specified value (or whatever
     * requestAnimationFrame returns if value is undefined).
     *
     * @param value
     * @returns {Promise<unknown>}
     */
    static frame( value ) {

        return new Promise( resolve => requestAnimationFrame( 'undefined' === typeof value ?
            resolve : () => resolve( value ) ) );

    }

    /**
     * Returns a promise that resolves at Vue.$nextTick() with the specified value (or whatever Vue.$nextTick() returns
     * if value is undefined).
     *
     * @param vm
     * @param value
     * @returns {Promise<unknown>}
     */
    static tick( vm, value ) {

        return new Promise( resolve => vm.$nextTick( 'undefined' === typeof value ?
            resolve : () => resolve( value ) ) );

    }


    static async wait( dependency, ...dependencies ) {

        switch ( dependency ) {

            case TickDependency:
                await Promise.resolve();
                break;

        }

        if ( 0 < dependencies.length ) {

            return await this.wait( ...dependencies );

        }

    }

}
