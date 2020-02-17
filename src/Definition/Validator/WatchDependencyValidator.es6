/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AbstractDependencyValidator from './AbstractDependencyValidator';
import AndExpectation from 'data-expectation/src/Expectation/AndExpectation';
import NotExpectation from 'data-expectation/src/Expectation/NotExpectation';
import EmptyExpectation from 'data-expectation/src/Expectation/EmptyExpectation';
import StringExpectation from 'data-expectation/src/Expectation/StringExpectation';
import AnythingExpectation from 'data-expectation/src/Expectation/AnythingExpectation';

export default class WatchDependencyValidator extends AbstractDependencyValidator {

    static getComponentExpectation() {

        return new AnythingExpectation();

    }

    static getPropertyExpectation() {

        return new AndExpectation(

            new NotExpectation( new EmptyExpectation() ),
            new StringExpectation()

        );

    }

    static getFalsyValueExpectation() {

        return new AnythingExpectation();

    }

    static getArrayExpectations() {

        return [

            this.createArrayExpectation( 'watch', this.getComponentExpectation(), this.getPropertyExpectation(),
                this.getFalsyValueExpectation() ),

        ];

    }

    static getObjectExpectations() {

        return [

            this.createObjectExpectation( 'watch', {

                component: this.getComponentExpectation(),
                property: this.getPropertyExpectation(),
                falsyValue: this.getFalsyValueExpectation(),

            } ),

        ];

    }

}
