/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { mount } from '@vue/test-utils';

import TickDependency from '../../../src/Dependency/TickDependency';
import Assert from '../../Assert';
import Util from '../../Util';

describe( 'TickDependency', () => {

    it( 'is initially pending', async () => {

        const vm = mount( { template: '<div/>' } ).vm;
        const dependency = new TickDependency( 'test', vm );

        await Promise.resolve();

        Assert.Dependency.assertPending( dependency );
        await Assert.Promise.assertPending( dependency.promise );

    } );

    it( 'is fulfilled on vm.$nextTick()', async () => {

        const vm = mount( { template: '<div/>' } ).vm;
        const dependency = new TickDependency( 'test', vm );

        await Promise.resolve();
        await Util.tick( vm );

        Assert.Dependency.assertFulfilled( dependency, vm );
        Assert.Promise.assertResolved( dependency.promise, vm );

    } );

    it( 'can be fulfilled manually before vm.$nextTick()', async () => {

        const vm = mount( { template: '<div/>' } ).vm;
        const dependency = new TickDependency( 'test', vm );

        await Promise.resolve();
        dependency.fulfil( vm );

        Assert.Dependency.assertFulfilled( dependency, vm );
        Assert.Promise.assertResolved( dependency.promise, vm );

    } );

} );
