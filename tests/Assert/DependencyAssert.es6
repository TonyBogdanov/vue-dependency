/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { expect } from 'chai';

export default class DependencyAssert {

    static assertPending( dependency ) {

        expect( dependency.name, 'name' ).to.equal( 'test' );

        expect( dependency.state, 'state' ).to.be['null'];
        expect( dependency.value, 'value' ).to.be['null'];

        expect( dependency._resolvers, '_resolvers' ).to.be.an( 'array' ).that.is.empty;
        expect( dependency._rejectors, '_rejectors' ).to.be.an( 'array' ).that.is.empty;

        expect( dependency.fulfilled, 'fulfilled' ).to.be['false'];
        expect( dependency.failed, 'failed' ).to.be['false'];

        expect( dependency.pending, 'pending' ).to.be['true'];

    }

    static assertFulfilled( dependency ) {

        expect( dependency.state, 'state' ).to.be['true'];
        expect( dependency.value, 'value' ).to.equal( 'fulfil' );

        expect( dependency._resolvers, '_resolvers' ).to.be.an( 'array' ).that.is.empty;
        expect( dependency._rejectors, '_rejectors' ).to.be.an( 'array' ).that.is.empty;

        expect( dependency.fulfilled, 'fulfilled' ).to.be['true'];
        expect( dependency.failed, 'failed' ).to.be['false'];

        expect( dependency.pending, 'pending' ).to.be['false'];

        // No further fulfilment / failure allowed.
        expect( () => dependency.fulfil( 'error' ), 'post-fulfil' ).to.throw();
        expect( () => dependency.fail( 'error' ), 'post-fail' ).to.throw();

    }

    static assertFailed( dependency ) {

        expect( dependency.state, 'state' ).to.be['false'];
        expect( dependency.value, 'value' ).to.equal( 'fail' );

        expect( dependency._resolvers, '_resolvers' ).to.be.an( 'array' ).that.is.empty;
        expect( dependency._rejectors, '_rejectors' ).to.be.an( 'array' ).that.is.empty;

        expect( dependency.fulfilled, 'fulfilled' ).to.be['false'];
        expect( dependency.failed, 'failed' ).to.be['true'];

        expect( dependency.pending, 'pending' ).to.be['false'];

        // No further fulfilment / failure allowed.
        expect( () => dependency.fulfil( 'error' ), 'post-fulfil' ).to.throw();
        expect( () => dependency.fail( 'error' ), 'post-fail' ).to.throw();

    }

}