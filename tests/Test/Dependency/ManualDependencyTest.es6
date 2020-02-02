/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ManualDependency from '../../../src/Dependency/ManualDependency';
import Assert from '../../Assert';
import Util from '../../Util';

describe( 'ManualDependency', () => {

    it( 'is initially pending', async () => {

        const dependency = new ManualDependency( 'test' );

        await Promise.resolve();

        Assert.Dependency.assertPending( dependency );
        await Assert.Promise.assertPending( dependency.promise );

    } );

    it( 'can be fulfilled manually', async () => {

        const dependency = new ManualDependency( 'test' );

        await Promise.resolve();
        await Util.sleep( 10 );

        dependency.fulfil( 'fulfil' );

        Assert.Dependency.assertFulfilled( dependency );
        Assert.Promise.assertResolved( dependency.promise, 'fulfil' );

    } );

    it( 'can be failed manually', async () => {

        const dependency = new ManualDependency( 'test' );

        await Promise.resolve();
        await Util.sleep( 10 );

        dependency.fail( 'fail' );

        Assert.Dependency.assertFailed( dependency );
        Assert.Promise.assertRejected( dependency.promise, 'fail' );

    } );

} );
