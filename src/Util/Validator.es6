/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class Validator {

    constructor( greeting ) {

        this.greeting = greeting;

    }

    expect( value, message, expectation ) {

        try {

            expectation.expect( value );

        } catch ( e ) {

            throw `${ this.greeting }${ message ? `, ${ message }` : '' }: ${ e.message }`;

        }

    }

}
