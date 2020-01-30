/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import PromiseDependency from '../../../src/Dependency/PromiseDependency';
import Assert from '../../Assert';
import Util from '../../Util';

describe( 'PromiseDependency', () => {

    it( 'is initially pending, if promise is pending', async () => {

        const dependency = new PromiseDependency( 'test', Util.sleep( 1 ) );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        Assert.Dependency.assertPending( dependency );
        await Assert.Promise.assertPending( dependency.promise );

    } );

    it( 'is initially fulfilled, if promise is resolved', async () => {

        const dependency = new PromiseDependency( 'test', Promise.resolve( 'fulfil' ) );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        Assert.Dependency.assertFulfilled( dependency );
        Assert.Promise.assertResolved( dependency.promise, 'fulfil' );

    } );

    it( 'is initially failed, if promise is rejected', async () => {

        const dependency = new PromiseDependency( 'test', Promise.reject( 'fail' ) );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        Assert.Dependency.assertFailed( dependency );
        Assert.Promise.assertRejected( dependency.promise, 'fail' );

    } );

    it( 'is fulfilled when promise resolves', async () => {

        const dependency = new PromiseDependency( 'test', Util.sleep( 1, 'fulfil' ) );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        // Wait for promise to resolve.
        await Util.sleep( 2 );

        Assert.Dependency.assertFulfilled( dependency );
        Assert.Promise.assertResolved( dependency.promise, 'fulfil' );

    } );

    it( 'is failed when promise rejects', async () => {

        const dependency = new PromiseDependency( 'test', ( async () => {

            await Util.sleep( 1 );
            throw 'fail';

        } )() );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        // Wait for promise to reject.
        await Util.sleep( 2 );

        Assert.Dependency.assertFailed( dependency );
        Assert.Promise.assertRejected( dependency.promise, 'fail' );

    } );

    it( 'can be fulfilled manually before the promise', async () => {

        const dependency = new PromiseDependency( 'test', Util.sleep( 1, 'fulfil' ) );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        // Fulfil manually.
        dependency.fulfil( 'fulfil' );

        Assert.Dependency.assertFulfilled( dependency );
        Assert.Promise.assertResolved( dependency.promise, 'fulfil' );

    } );

    it( 'can be failed manually before the promise', async () => {

        const dependency = new PromiseDependency( 'test', ( async () => {

            await Util.sleep( 1 );
            throw 'fail';

        } )() );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        // Fail manually.
        dependency.fail( 'fail' );

        Assert.Dependency.assertFailed( dependency );
        Assert.Promise.assertRejected( dependency.promise, 'fail' );

    } );

} );
