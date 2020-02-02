/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import isArray from 'data-types-js/src/is/isArray';

export default class Debug {

    static _log( type, message, ...args ) {

        let counter = 3;

        while ( true ) {

            const match = message.match( /%(s)/ );
            if ( ! match ) {

                break;

            }

            message = `${ message.substr( 0, match.index ) }%1$c%${ counter++ }$${ match[1] }%2$c${
                message.substr( match.index + match[0].length ) }`;

        }

        console[ type ](

            `%1$c[VueDependency]%2$c ${ message }`,
            `font-weight:700;color:#2196f3;`,
            'font-weight:inherit;color:inherit;',
            ...args

        );

    }

    static error( message, ...args ) {

        if ( isArray( message ) ) {

            this.error( ...message );
            return

        }

        this._log( 'error', message, ...args );

    }

    static debug( message, ...args ) {

        if ( isArray( message ) ) {

            this.debug( ...message );
            return

        }

        this._log( 'debug', message, ...args );

    }

}
