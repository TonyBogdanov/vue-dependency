/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { mount } from '@vue/test-utils';

import WatchDependency from '../../../src/Dependency/WatchDependency';
import Assert from '../../Assert';
import Util from '../../Util';

describe( 'WatchDependency', () => {

    it( 'is initially fulfilled, if property is non-falsy', async () => {

        const vm = mount( {

            template: `<div/>`,
            computed: {

                test() {

                    return 'fulfil';

                },

            },

        } ).vm;

        const dependency = new WatchDependency( 'test', vm, 'test', false );

        await Promise.resolve();

        Assert.Dependency.assertFulfilled( dependency );
        Assert.Promise.assertResolved( dependency.promise, 'fulfil' );

        vm.$destroy();

    } );

    it( 'is initially pending, if property is falsy', async () => {

        const vm = mount( {

            template: `<div/>`,
            computed: {

                test() {

                    return false;

                },

            },

        } ).vm;

        const dependency = new WatchDependency( 'test', vm, 'test', false );

        await Promise.resolve();

        Assert.Dependency.assertPending( dependency );
        await Assert.Promise.assertPending( dependency.promise );

        vm.$destroy();

    } );

    it( 'is fulfilled when property becomes non-falsy', async () => {

        const vm = mount( {

            template: `<div/>`,
            data() {

                return {

                    test: false,

                };

            },

        } ).vm;

        const dependency = new WatchDependency( 'test', vm, 'test', false );

        await Promise.resolve();

        vm.test = 'fulfil';
        await Util.sleep( 10 );

        Assert.Dependency.assertFulfilled( dependency );
        Assert.Promise.assertResolved( dependency.promise, 'fulfil' );

        vm.$destroy();

    } );

} );
