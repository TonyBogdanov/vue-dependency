/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import DefinitionMap from './Definition/DefinitionMap';
import ComponentName from './Util/ComponentName';

export default class DependencyGraph {

    constructor( vm ) {

        this.vm = vm;

    }

    async invoke( dependencies ) {

        // Expect a definition map.
        if ( ! ( dependencies instanceof DefinitionMap ) ) {

            /* vue_dependency_strict:start */
            throw [

                'Cannot invoke the dependency graph for component %s, provided data is not a valid definition map.' +
                ' Run your definitions through the normalizer first.',
                ComponentName.get( this.vm ),

            ];
            /* vue_dependency_strict:end */

            return;

        }

        // Make sure the map hasn't been unpacked yet.
        if ( dependencies.unpacked ) {

            /* vue_dependency_strict:start */
            throw [

                'Cannot invoke the dependency graph for component %s, the definition map has already been unpacked.',
                ComponentName.get( this.vm ),

            ];
            /* vue_dependency_strict:end */

            return;

        }

        // Unpack the definition map (convert to a map of dependency objects).
        /* vue_dependency_strict:start */
        try {
        /* vue_dependency_strict:end */

            dependencies = await dependencies.unpack( this.vm );

        /* vue_dependency_strict:start */
        } catch ( error ) {

            throw [

                'Cannot invoke the dependency graph for component %s, the definition map failed to unpack.',
                ComponentName.get( this.vm ),
                error

            ];

        }
        /* vue_dependency_strict:end */

        try {

            // Resolve dependency promises & collect the result.
            const result = await Promise.all( Object.values( dependencies ).map( dependency => dependency.promise ) );

            // Transform the result & construct the payload.
            const payload = Object.keys( dependencies ).reduce( ( payload, name, index ) => {

                payload[ name ] = result[ index ].value;
                return payload;

            }, {} );

            // Resolve the promise.
            return [ payload, dependencies ];

        } catch ( error ) {

            // Dependency has failed.
            throw [ error, dependencies ];

        }

    }

}
