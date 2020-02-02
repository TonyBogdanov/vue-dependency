/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AllDependency from '../../../src/Dependency/AllDependency';
import Assert from '../../Assert';
import FrameDependency from '../../../src/Dependency/FrameDependency';
import ManualDependency from '../../../src/Dependency/ManualDependency';
import Util from '../../Util';

describe( 'AllDependency', () => {

    it( 'is initially pending', async () => {

        const manual = new ManualDependency( 'test' );
        const dependency = new AllDependency( 'test', manual, new FrameDependency( 'test' ) );

        await Promise.resolve();
        await Promise.resolve();

        Assert.Dependency.assertPending( dependency );
        await Assert.Promise.assertPending( dependency.promise );

    } );

    it( 'remains pending when only one dependency fulfils', async () => {

        const manual = new ManualDependency( 'test' );
        const dependency = new AllDependency( 'test', manual, new FrameDependency( 'test' ) );

        await Promise.resolve();
        await Util.frame();
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();

        Assert.Dependency.assertPending( dependency );
        await Assert.Promise.assertPending( dependency.promise );

    } );

    it( 'fulfils when both dependencies fulfil', async () => {

        const manual = new ManualDependency( 'test' ).fulfil( 'fulfil' );
        const dependency = new AllDependency( 'test', manual, new FrameDependency( 'test' ) );

        await Promise.resolve();
        await Util.frame();
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();

        Assert.Dependency.assertFulfilled( dependency, [ 'fulfil', '__raf__' ] );
        Assert.Promise.assertResolved( dependency.promise, [ 'fulfil', '__raf__' ] );

    } );

    it( 'fails when either dependency fails', async () => {

        const manual = new ManualDependency( 'test' ).fail( 'fail' );
        const dependency = new AllDependency( 'test', manual, new FrameDependency( 'test' ) );

        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();

        Assert.Dependency.assertFailed( dependency, 'fail' );
        Assert.Promise.assertRejected( dependency.promise, 'fail' );

    } );

} );
