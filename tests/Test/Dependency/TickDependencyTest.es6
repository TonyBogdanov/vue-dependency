/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue/dist/vue.esm';

import TickDependency from '../../../src/Dependency/TickDependency';
import Assert from '../../Assert';
import Util from '../../Util';

describe( 'TickDependency', () => {

    it( 'is initially pending', async () => {

        const vm = new Vue();

        const dependency = new TickDependency( 'test', vm );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        Assert.Dependency.assertPending( dependency );
        await Assert.Promise.assertPending( dependency.promise );

    } );

    it( 'is fulfilled on vm.$nextTick()', async () => {

        const vm = new Vue();

        const dependency = new TickDependency( 'test', vm );
        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.

        // Wait for vm.$nextTick().
        await Util.tick( vm );

        Assert.Dependency.assertFulfilled( dependency, vm );
        await Assert.Promise.assertResolved( dependency.promise, vm );

    } );

} );
