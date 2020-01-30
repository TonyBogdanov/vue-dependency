/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AnyDependency from '../../../src/Dependency/AnyDependency';
import Assert from '../../Assert';
import FrameDependency from '../../../src/Dependency/FrameDependency';
import ManualDependency from '../../../src/Dependency/ManualDependency';
import Util from '../../Util';

describe( 'AnyDependency', () => {

    it( 'is initially pending', async () => {

        const manual = new ManualDependency( 'test' );
        const dependency = new AnyDependency( 'test', manual, new FrameDependency( 'test' ) );

        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        Assert.Dependency.assertPending( dependency );
        await Assert.Promise.assertPending( dependency.promise );

    } );

    it( 'fulfils when when only one dependency fulfils', async () => {

        const manual = new ManualDependency( 'test' ).fulfil( 'fulfil' );
        const dependency = new AnyDependency( 'test', manual, new FrameDependency( 'test' ) );

        // Wait for the active dependency chain.
        await Promise.resolve();
        await Promise.resolve();

        Assert.Dependency.assertFulfilled( dependency, 'fulfil' );
        await Assert.Promise.assertResolved( dependency.promise, 'fulfil' );

    } );

    it( 'fulfils when both dependencies fulfil', async () => {

        const manual = new ManualDependency( 'test' ).fulfil( 'fulfil' );
        const dependency = new AnyDependency( 'test', manual, new FrameDependency( 'test' ) );

        // Wait for the entire dependency chain.
        await Promise.resolve();
        await Util.frame();
        await Promise.resolve();
        await Promise.resolve();

        Assert.Dependency.assertFulfilled( dependency, 'fulfil' );
        await Assert.Promise.assertResolved( dependency.promise, 'fulfil' );

    } );

    it( 'fails when either dependency fails', async () => {

        const manual = new ManualDependency( 'test' ).fail( 'fail' );
        const dependency = new AnyDependency( 'test', manual, new FrameDependency( 'test' ) );

        // Wait for the active dependency chain.
        await Promise.resolve();
        await Promise.resolve();

        Assert.Dependency.assertFailed( dependency, 'fail' );
        Assert.Promise.assertRejected( dependency.promise, 'fail' );

    } );

} );
