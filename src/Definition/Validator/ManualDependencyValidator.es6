/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AbstractDependencyValidator from './AbstractDependencyValidator';

export default class ManualDependencyValidator extends AbstractDependencyValidator {

    static getArrayExpectations() {

        return [

            this.createArrayExpectation( 'manual' ),

        ];

    }

    static getObjectExpectations() {

        return [

            this.createObjectExpectation( 'manual' ),

        ];

    }

}
