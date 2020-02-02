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
import AnythingExpectation from 'data-expectation/src/Expectation/AnythingExpectation';
import FunctionExpectation from 'data-expectation/src/Expectation/FunctionExpectation';
import IntegerExpectation from 'data-expectation/src/Expectation/IntegerExpectation';
import GreaterThanOrEqualExpectation from 'data-expectation/src/Expectation/GreaterThanOrEqualExpectation';
import LowerThanOrEqualExpectation from 'data-expectation/src/Expectation/LowerThanOrEqualExpectation';

export default class PollDependencyValidator extends AbstractDependencyValidator {

    static getCallbackExpectation() {

        return new AndExpectation(

            new NotExpectation( new EmptyExpectation() ),
            new FunctionExpectation()

        );

    }

    static getFalsyValueExpectation() {

        return new AnythingExpectation();

    }

    static getIntervalExpectation() {

        return new AndExpectation(

            new IntegerExpectation(),
            new GreaterThanOrEqualExpectation( 1 ),
            new LowerThanOrEqualExpectation( 20000 )

        );

    }

    static getLimitExpectation() {

        return new AndExpectation(

            new IntegerExpectation(),
            new GreaterThanOrEqualExpectation( 1 ),
            new LowerThanOrEqualExpectation( 20000 )

        );

    }

    static getArrayExpectations() {

        return [

            this.createArrayExpectation( 'poll', this.getCallbackExpectation(), this.getFalsyValueExpectation() ),

            this.createArrayExpectation( 'poll', this.getCallbackExpectation(), this.getFalsyValueExpectation(),
                this.getIntervalExpectation() ),

            this.createArrayExpectation( 'poll', this.getCallbackExpectation(), this.getFalsyValueExpectation(),
                this.getIntervalExpectation(), this.getLimitExpectation() ),

        ];

    }

    static getObjectExpectations() {

        return [

            this.createObjectExpectation( 'poll', {

                callback: this.getCallbackExpectation(),
                falsyValue: this.getFalsyValueExpectation(),

            } ),

            this.createObjectExpectation( 'poll', {

                callback: this.getCallbackExpectation(),
                falsyValue: this.getFalsyValueExpectation(),
                interval: this.getIntervalExpectation(),

            } ),

            this.createObjectExpectation( 'poll', {

                callback: this.getCallbackExpectation(),
                falsyValue: this.getFalsyValueExpectation(),
                interval: this.getIntervalExpectation(),
                limit: this.getLimitExpectation(),

            } ),

        ];

    }

}
