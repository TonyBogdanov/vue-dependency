/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import FrameDependency from '../../../src/Dependency/FrameDependency';
import Assert from '../../Assert';
import Util from '../../Util';

describe( 'FrameDependency', () => {

    it( 'is initially pending', async () => {

        const dependency = new FrameDependency( 'test' );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        Assert.Dependency.assertPending( dependency );
        await Assert.Promise.assertPending( dependency.promise );

    } );

    it( 'is fulfilled on the next frame', async () => {

        const dependency = new FrameDependency( 'test' );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        // Wait for next frame.
        await Util.frame();

        Assert.Dependency.assertFulfilled( dependency, '__raf__' );
        await Assert.Promise.assertResolved( dependency.promise, '__raf__' );

    } );

    it( 'can be fulfilled manually before the next frame', async () => {

        const dependency = new FrameDependency( 'test' );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        // Fulfil manually.
        dependency.fulfil( '__raf__' );

        Assert.Dependency.assertFulfilled( dependency, '__raf__' );
        await Assert.Promise.assertResolved( dependency.promise, '__raf__' );

    } );

} );
