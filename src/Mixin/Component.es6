/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import isFunction from 'data-types-js/src/is/isFunction';

import Normalizer from '../Definition/Normalizer';
import ComponentName from '../Util/ComponentName';
import Debug from '../Util/Debug';
import DependencyGraph from '../DependencyGraph';

const callbacks = ( vm, name ) => {

    const result = [];

    if ( isFunction( vm.$options[ name ] ) ) {

        result.push( vm.$options[ name ] );

    }

    if ( ! vm.$options.mixins || 0 === vm.$options.mixins.length ) {

        return result;

    }

    for ( const mixin of vm.$options.mixins ) {

        if ( isFunction( mixin[ name ] ) && -1 === result.indexOf( mixin[ name ] ) ) {

            result.push( mixin[ name ] );

        }

    }

    return result;

};

/**
 * Apply mixin by calling Vue.mixin( Component.mixin ).
 */
export default class Component {

    static get mixin() {

        return {

            data() {

                return {

                    registered: false,

                };

            },

            mounted() {

                // Ignore further logic if dependencies aren't defined. Components that rely on the "registered"
                // lifecycle callback MUST expose dependencies, even if they are empty.
                if ( 'undefined' === typeof this.dependencies ) {

                    /* vue_dependency_debug:start */
                    Debug.debug(

                        `Ignoring component %s, as it does not expose any dependencies.`,
                        ComponentName.get( this )

                    );
                    /* vue_dependency_debug:end */

                    return;

                }

                new Normalizer( this ).normalizeDefinitions( this.dependencies ).then(

                    definitions => new DependencyGraph( this ).invoke( definitions ).then(

                        ( [ payload, dependencies ] ) => {

                            this.registered = payload;

                            for ( const callback of callbacks( this, 'registered' ) ) {

                                callback.call( this, payload, dependencies );

                            }

                        },

                        ( [ dependency, dependencies ] ) => {

                            for ( const callback of callbacks( this, 'registeredError' ) ) {

                                callback.call( this, dependency, dependencies );

                            }

                        }

                    )

                    /* vue_dependency_debug:start */ , error => Debug.error( error ) /* vue_dependency_debug:end */

                );

            },

        };

    }

}
