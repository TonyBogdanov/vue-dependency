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

    static assertFulfilled( dependency, reason = 'fulfil' ) {

        const assert = ( retry = false ) => {

            expect( dependency.state, `state${ retry ? ' (retry)' : '' }` ).to.be['true'];
            expect( dependency.value, `value${ retry ? ' (retry)' : '' }` ).to.equal( reason );

            expect( dependency._resolvers, `_resolvers${ retry ? ' (retry)' : '' }` ).to.be.an( 'array' ).that.is.empty;
            expect( dependency._rejectors, `_rejectors${ retry ? ' (retry)' : '' }` ).to.be.an( 'array' ).that.is.empty;

            expect( dependency.fulfilled, `fulfilled${ retry ? ' (retry)' : '' }` ).to.be['true'];
            expect( dependency.failed, `failed${ retry ? ' (retry)' : '' }` ).to.be['false'];

            expect( dependency.pending, `pending${ retry ? ' (retry)' : '' }` ).to.be['false'];

        };

        // Further fulfilment / failure has no effect.
        expect( dependency.fulfil( 'further' ), 'post-fulfil' ).to.equal( dependency );
        assert( true );

        expect( dependency.fail( 'further' ), 'post-fail' ).to.equal( dependency );
        assert( true );

    }

    static assertFailed( dependency, reason = 'fail' ) {

        const assert = ( retry = false ) => {

            expect( dependency.state, `state${ retry ? ' (retry)' : '' }` ).to.be['false'];
            expect( dependency.value, `value${ retry ? ' (retry)' : '' }` ).to.equal( reason );

            expect( dependency._resolvers, `_resolvers${ retry ? ' (retry)' : '' }` ).to.be.an( 'array' ).that.is.empty;
            expect( dependency._rejectors, `_rejectors${ retry ? ' (retry)' : '' }` ).to.be.an( 'array' ).that.is.empty;

            expect( dependency.fulfilled, `fulfilled${ retry ? ' (retry)' : '' }` ).to.be['false'];
            expect( dependency.failed, `failed${ retry ? ' (retry)' : '' }` ).to.be['true'];

            expect( dependency.pending, `pending${ retry ? ' (retry)' : '' }` ).to.be['false'];

        };

        // Further fulfilment / failure has no effect.
        expect( dependency.fulfil( 'further' ), 'post-fulfil' ).to.equal( dependency );
        assert( true );

        expect( dependency.fail( 'further' ), 'post-fail' ).to.equal( dependency );
        assert( true );

    }

}
