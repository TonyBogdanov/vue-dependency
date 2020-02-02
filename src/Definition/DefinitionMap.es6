/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Debug from '../Util/Debug';
import ComponentName from '../Util/ComponentName';

/**
 * Holds a normalized map of packed definitions.
 */
export default class DefinitionMap {

    constructor( definitions ) {

        this.definitions = definitions;
        this.unpacked = false;

    }

    async unpack( vm ) {

        this.unpacked = true;

        return Object.keys( this.definitions ).reduce( ( dependencies, name ) => {

            /* vue_dependency_strict:start */
            Debug.debug(

                'Unpacking dependency %s for component %s.',
                name,
                ComponentName.get( vm )

            );
            /* vue_dependency_strict:end */

            dependencies[ name ] = this.definitions[ name ]();
            return dependencies;

        }, {} );

    }

}
