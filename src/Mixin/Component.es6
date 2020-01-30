/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import DependencyGraph from '../DependencyGraph';

/**
 * Apply mixin by calling Vue.mixin( Component.mixin ).
 */
export default class Component {

    static get mixin() {

        return {

            computed: {

                dependencyGraph() {

                    return new DependencyGraph( this );

                },

                dependencies() {

                    return {};

                },

            },

            mounted() {

                // If there are no dependencies at this point, we don't need to proceed any further, as there is no
                // more time left to register dependencies before the graph is sealed anyway.
                if ( 0 === Object.values( this.dependencies ).length ) {

                    return;

                }

                this.dependencyGraph.registerDependencies( this.dependencies ).invoke();

            },

        };

    }

}
