/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use( chaiAsPromised );
const expect = chai.expect;

export default class PromiseAssert {

    static async isPending( promise ) {

        const token = /token/;

        try {

            const result = await Promise.race( [ promise, Promise.resolve( token ) ] );
            if ( result === token ) {

                return true;

            }

        } catch ( e ) {}

        return false;

    }

    static async assertPending( promise ) {

        expect( await this.isPending( promise ) ).to.be['true'];

    }

    static assertResolved( promise, value ) {

        expect( promise ).to.become( value );

    }

    static assertRejected( promise, value ) {

        expect( promise ).to.be.rejectedWith( value );

    }

}
