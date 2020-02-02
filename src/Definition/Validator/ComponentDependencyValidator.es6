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
import IntegerExpectation from 'data-expectation/src/Expectation/IntegerExpectation';
import GreaterThanOrEqualExpectation from 'data-expectation/src/Expectation/GreaterThanOrEqualExpectation';
import LowerThanOrEqualExpectation from 'data-expectation/src/Expectation/LowerThanOrEqualExpectation';

export default class ComponentDependencyValidator extends AbstractDependencyValidator {

    static getRefExpectation() {

        return new AndExpectation(

            new NotExpectation( new EmptyExpectation() ),
            new StringExpectation()

        );

    }

    static getPollIntervalExpectation() {

        return new AndExpectation(

            new IntegerExpectation(),
            new GreaterThanOrEqualExpectation( 1 ),
            new LowerThanOrEqualExpectation( 20000 )

        );

    }

    static getPollLimitExpectation() {

        return new AndExpectation(

            new IntegerExpectation(),
            new GreaterThanOrEqualExpectation( 1 ),
            new LowerThanOrEqualExpectation( 20000 )

        );

    }

    static getArrayExpectations() {

        return [

            this.createArrayExpectation( 'component', this.getRefExpectation() ),

            this.createArrayExpectation( 'component', this.getRefExpectation(), this.getPollIntervalExpectation() ),

            this.createArrayExpectation( 'component', this.getRefExpectation(), this.getPollIntervalExpectation(),
                this.getPollLimitExpectation() ),

        ];

    }

    static getObjectExpectations() {

        return [

            this.createObjectExpectation( 'component', {

                ref: this.getRefExpectation(),

            } ),

            this.createObjectExpectation( 'component', {

                ref: this.getRefExpectation(),
                pollInterval: this.getPollIntervalExpectation(),

            } ),

            this.createObjectExpectation( 'component', {

                ref: this.getRefExpectation(),
                pollInterval: this.getPollIntervalExpectation(),
                pollLimit: this.getPollLimitExpectation(),

            } ),

        ];

    }

}
