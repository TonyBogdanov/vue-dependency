/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import PollDependency from '../../../src/Dependency/PollDependency';
import Assert from '../../Assert';
import Util from '../../Util';

const createPoll = cycles => () => 0 === cycles-- ? 'fulfil' : false;
const createError = cycles => () => {

    if ( 0 === cycles-- ) {

        throw 'fail';

    }

    return false;

};

describe( 'PollDependency', () => {

    it( 'is initially pending, if poll is falsy', async () => {

        const dependency = new PollDependency( 'test', createPoll( 1 ), false );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        Assert.Dependency.assertPending( dependency );
        await Assert.Promise.assertPending( dependency.promise );

    } );

    it( 'is initially fulfilled, if poll is truthy', async () => {

        const dependency = new PollDependency( 'test', createPoll( 0 ), false );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        Assert.Dependency.assertFulfilled( dependency );
        await Assert.Promise.assertResolved( dependency.promise, 'fulfil' );

    } );

    it( 'is initially failed, if poll throws an error', async () => {

        const dependency = new PollDependency( 'test', createError( 0 ), false );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        Assert.Dependency.assertFailed( dependency );
        await Assert.Promise.assertRejected( dependency.promise, 'fail' );

    } );

    it( 'is fulfilled when poll becomes truthy', async () => {

        const dependency = new PollDependency( 'test', createPoll( 1 ), false );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        // Wait for poll to become truthy.
        await Util.sleep( 2 );

        Assert.Dependency.assertFulfilled( dependency );
        await Assert.Promise.assertResolved( dependency.promise, 'fulfil' );

    } );

    it( 'is failed when poll throws an error', async () => {

        const dependency = new PollDependency( 'test', createError( 1 ), false );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        // Wait for poll to throw error.
        await Util.sleep( 2 );

        Assert.Dependency.assertFailed( dependency );
        await Assert.Promise.assertRejected( dependency.promise, 'fail' );

    } );

    it( 'can be fulfilled manually before the poll function', async () => {

        const dependency = new PollDependency( 'test', createPoll( 1 ), false );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        // Fulfil manually.
        dependency.fulfil( 'fulfil' );

        Assert.Dependency.assertFulfilled( dependency );
        await Assert.Promise.assertResolved( dependency.promise, 'fulfil' );

    } );

    it( 'can be failed manually before the poll function', async () => {

        const dependency = new PollDependency( 'test', createError( 1 ), false );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        // Fail manually.
        dependency.fail( 'fail' );

        Assert.Dependency.assertFailed( dependency );
        await Assert.Promise.assertRejected( dependency.promise, 'fail' );

    } );

} );
