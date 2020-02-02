/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AbstractDependency from './AbstractDependency';

/**
 * Provides a dependency that fulfils when any of the supplied dependencies fulfil, or fails when any of the supplied
 * dependencies fail. Only the very first fulfilment / failure will be tracked, further ones will be ignored.
 *
 * The fulfilled value will be the fulfilment value of the first fulfilled dependency.
 * The failure value will be the failure value of the first failed dependency.
 *
 * This can be useful when you have multiple dependencies using different methods of waiting for the same thing, so
 * you only care for the very first fulfilment of any of the dependencies.
 */
export default class AnyDependency extends AbstractDependency {

    static type = 'any';

    constructor( name, ...dependencies ) {

        super( name, Promise.race( dependencies.map( dependency => dependency.promise ) ).then(

            dependency => dependency.value,
            dependency => { throw dependency.value; }

        ) );

    }

}
