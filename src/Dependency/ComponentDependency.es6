/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AbstractDependency from './AbstractDependency';
import RefDependency from './RefDependency';

/**
 * Provides a dependency that fulfils when a component with the specified reference becomes both available under
 * $refs of the specified component, and finishes registering, i.e. all of it's dependencies are also fulfilled.
 *
 * The fulfilled value will be the component component.$refs[ name ] is pointing to.
 * This dependency never fails, it can only hang as pending.
 *
 * Dependency failure of child components will NOT trigger failure of this dependency.
 *
 * This can be useful when you need to ensure all of your component's dependencies are fulfilled, all of it's
 * components, both synchronous and asynchronous, are loaded, stamped and registered (their respective dependencies
 * are also fulfilled).
 */
class ComponentDependency extends AbstractDependency {

    constructor( name, component, ref, pollInterval = 1, pollLimit = 20000 ) {

        super( name, new Promise( resolve =>
            new RefDependency( name, component, ref, pollInterval, pollLimit ).promise.then( dependency => {

                if ( dependency.value.registered ) {

                    return resolve( dependency.value );

                }

                let unwatch;
                unwatch = dependency.value.$watch( 'registered', registered => {

                    if ( ! registered ) {

                        return;

                    }

                    unwatch();
                    resolve( dependency.value );

                }, { immediate: true } );

            } ) ) );

    }

}

ComponentDependency.type = 'component';

export default ComponentDependency;
