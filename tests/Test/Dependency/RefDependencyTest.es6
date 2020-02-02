/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { mount } from '@vue/test-utils';

import RefDependency from '../../../src/Dependency/RefDependency';
import Assert from '../../Assert';
import Util from '../../Util';

const createSyncNative = () => mount( { template: `<div><div ref="ref"/></div>` } ).vm;

const createSyncVFor = () => mount( {

    template: `<div><div :ref="i" :key="i" v-for="i in loop"/></div>`,

    data() {

        return {

            loop: [ 'ref' ],

        };

    },

} ).vm;

const createSyncComponent = () => mount( {

    template: `<div><test ref="ref"/></div>`,
    components: {

        test: {

            template: `<div/>`,

        },

    },

} ).vm;

const createAsyncComponent = delay => mount( {

    template: `<div><test ref="ref"/></div>`,
    components: {

        test: async () => {

            await Util.sleep( delay ); // Simulate network delay.
            return { render: create => create( 'div' ) };

        },

    },

} ).vm;

describe( 'RefDependency', () => {

    it( 'is initially fulfilled, if ref is synchronous (native)', async () => {

        const vm = createSyncNative();
        const dependency = new RefDependency( 'test', vm, 'ref', 1, 10 );

        await Promise.resolve();
        await Util.tick( vm );

        Assert.Dependency.assertFulfilled( dependency, vm.$refs.ref );
        Assert.Promise.assertResolved( dependency.promise, vm.$refs.ref );

        vm.$destroy();

    } );

    it( 'is initially fulfilled, if ref is synchronous (v-for)', async () => {

        const vm = createSyncVFor();
        const dependency = new RefDependency( 'test', vm, 'ref', 1, 10 );

        await Promise.resolve();
        await Util.tick( vm );

        Assert.Dependency.assertFulfilled( dependency, vm.$refs.ref[0] );
        Assert.Promise.assertResolved( dependency.promise, vm.$refs.ref[0] );

        vm.$destroy();

    } );

    it( 'is initially fulfilled, if ref is synchronous (component)', async () => {

        const vm = createSyncComponent();
        const dependency = new RefDependency( 'test', vm, 'ref', 1, 10 );

        await Promise.resolve();
        await Util.tick( vm );

        Assert.Dependency.assertFulfilled( dependency, vm.$refs.ref );
        Assert.Promise.assertResolved( dependency.promise, vm.$refs.ref );

        vm.$destroy();

    } );

    it( 'is initially pending, if ref is asynchronous', async () => {

        const vm = createAsyncComponent( 1 );
        const dependency = new RefDependency( 'test', vm, 'ref', 1, 10 );

        await Promise.resolve();
        await Util.tick( vm );

        Assert.Dependency.assertPending( dependency );
        await Assert.Promise.assertPending( dependency.promise );

        vm.$destroy();

    } );

    it( 'is fulfilled when ref is resolved (asynchronous)', async () => {

        const vm = createAsyncComponent( 1 );
        const dependency = new RefDependency( 'test', vm, 'ref', 1, 10 );

        await Promise.resolve();
        await Util.tick( vm );
        await Util.sleep( 10 );

        Assert.Dependency.assertFulfilled( dependency, vm.$refs.ref );
        Assert.Promise.assertResolved( dependency.promise, vm.$refs.ref );

        vm.$destroy();

    } );

} );
