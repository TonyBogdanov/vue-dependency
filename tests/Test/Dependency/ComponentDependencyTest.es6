/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { mount } from '@vue/test-utils';

import ComponentDependency from '../../../src/Dependency/ComponentDependency';
import Assert from '../../Assert';
import Util from '../../Util';

const createSyncComponent = ( registered, registerDelay = 0 ) => mount( {

    template: `<div><test ref="ref"/></div>`,
    components: {

        test: {

            template: `<div/>`,

            data() {

                return {

                    registered: registered,

                };

            },

            mounted() {

                if ( 0 < registerDelay ) {

                    Util.sleep( registerDelay ).then( () => this.registered = true );

                }

            },

        },

    },

} ).vm;

const createAsyncComponent = ( registered, networkDelay, registerDelay = 0 ) => mount( {

    template: `<div><test ref="ref"/></div>`,
    components: {

        test: async () => {

            await Util.sleep( networkDelay ); // Simulate network delay.
            return {

                render: create => create( 'div' ),

                data() {

                    return {

                        registered: registered,

                    };

                },

                mounted() {

                    if ( 0 < registerDelay ) {

                        Util.sleep( registerDelay ).then( () => this.registered = true );

                    }

                },

            };

        },

    },

} ).vm;

describe( 'ComponentDependency', () => {

    it( 'is initially pending, if component is initially not registered (synchronous)', async () => {

        const vm = createSyncComponent( false );
        const dependency = new ComponentDependency( 'test', vm, 'ref', 1, 10 );

        await Promise.resolve();
        await Util.tick( vm );
        await Promise.resolve();
        await Promise.resolve();

        Assert.Dependency.assertPending( dependency );
        await Assert.Promise.assertPending( dependency.promise );

        vm.$destroy();

    } );

    it( 'is initially fulfilled, if component is initially registered (synchronous)', async () => {

        const vm = createSyncComponent( true );
        const dependency = new ComponentDependency( 'test', vm, 'ref', 1, 10 );

        await Promise.resolve();
        await Util.tick( vm );
        await Promise.resolve();
        await Promise.resolve();

        Assert.Dependency.assertFulfilled( dependency, vm.$refs.ref );
        Assert.Promise.assertResolved( dependency.promise, vm.$refs.ref );

        vm.$destroy();

    } );

    it( 'is initially pending, if component is initially not registered (asynchronous)', async () => {

        const vm = createAsyncComponent( false, 1 );
        const dependency = new ComponentDependency( 'test', vm, 'ref', 1, 10 );

        await Promise.resolve();
        await Util.tick( vm );
        await Promise.resolve();
        await Promise.resolve();

        Assert.Dependency.assertPending( dependency );
        await Assert.Promise.assertPending( dependency.promise );

        vm.$destroy();

    } );

    it( 'is fulfilled when component is registered (synchronous)', async () => {

        const vm = createSyncComponent( false, 1 );
        const dependency = new ComponentDependency( 'test', vm, 'ref', 1, 10 );

        await Promise.resolve();
        await Util.tick( vm );
        await Promise.resolve();
        await Promise.resolve();

        await Util.sleep( 1 );
        await Util.tick( vm );

        Assert.Dependency.assertFulfilled( dependency, vm.$refs.ref );
        Assert.Promise.assertResolved( dependency.promise, vm.$refs.ref );

        vm.$destroy();

    } );

    it( 'is fulfilled when component is registered (asynchronous)', async () => {

        const vm = createAsyncComponent( false, 1, 1 );
        const dependency = new ComponentDependency( 'test', vm, 'ref', 1, 10 );

        await Promise.resolve();
        await Util.tick( vm );
        await Promise.resolve();
        await Promise.resolve();

        await Util.sleep( 1 );
        await Util.tick( vm );

        await Util.sleep( 10 );

        Assert.Dependency.assertFulfilled( dependency, vm.$refs.ref );
        Assert.Promise.assertResolved( dependency.promise, vm.$refs.ref );

        vm.$destroy();

    } );

} );
