/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue/dist/vue.esm';
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

    Vue.config.productionTip = false;
    Vue.config.devtools = false;

    it( 'is initially fulfilled, if ref is synchronous (native)', async () => {

        const vm = createSyncNative();
        const dependency = new RefDependency( 'test', vm, 'ref', 1, 1 );

        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.
        await Util.tick( vm ); // Wait for view to be stamped.

        Assert.Dependency.assertFulfilled( dependency, vm.$refs.ref );
        await Assert.Promise.assertResolved( dependency.promise, vm.$refs.ref );

        vm.$destroy();

    } );

    it( 'is initially fulfilled, if ref is synchronous (v-for)', async () => {

        const vm = createSyncVFor();
        const dependency = new RefDependency( 'test', vm, 'ref', 1, 1 );

        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.
        await Util.tick( vm ); // Wait for view to be stamped.

        Assert.Dependency.assertFulfilled( dependency, vm.$refs.ref[0] );
        await Assert.Promise.assertResolved( dependency.promise, vm.$refs.ref[0] );

        vm.$destroy();

    } );

    it( 'is initially fulfilled, if ref is synchronous (component)', async () => {

        const vm = createSyncComponent();
        const dependency = new RefDependency( 'test', vm, 'ref', 1, 1 );

        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.
        await Util.tick( vm ); // Wait for view to be stamped.

        Assert.Dependency.assertFulfilled( dependency, vm.$refs.ref );
        await Assert.Promise.assertResolved( dependency.promise, vm.$refs.ref );

        vm.$destroy();

    } );

    it( 'is initially pending, if ref is asynchronous', async () => {

        const vm = createAsyncComponent( 1 );
        const dependency = new RefDependency( 'test', vm, 'ref', 1, 10 );

        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.
        await Util.tick( vm ); // Wait for view to be stamped.

        Assert.Dependency.assertPending( dependency );
        await Assert.Promise.assertPending( dependency.promise );

        vm.$destroy();

    } );

    it( 'is fulfilled when ref is resolved (asynchronous)', async () => {

        const vm = createAsyncComponent( 1 );
        const dependency = new RefDependency( 'test', vm, 'ref', 1, 10 );

        await Promise.resolve(); // Wait one tick, or even immediately resolved promises will be run *after* this line.
        await Util.tick( vm ); // Wait for view to be stamped.
        await Util.sleep( 10 ); // Wait for simulated network activity.

        Assert.Dependency.assertFulfilled( dependency, vm.$refs.ref );
        await Assert.Promise.assertResolved( dependency.promise, vm.$refs.ref );

        vm.$destroy();

    } );

} );
