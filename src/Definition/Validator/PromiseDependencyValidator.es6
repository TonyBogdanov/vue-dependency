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
import ClassExpectation from 'data-expectation/src/Expectation/ClassExpectation';

export default class PromiseDependencyValidator extends AbstractDependencyValidator {

    static getPromiseExpectation() {

        return new AndExpectation(

            new NotExpectation( new EmptyExpectation() ),
            new ClassExpectation( Promise )

        );

    }

    static getArrayExpectations() {

        return [

            this.createArrayExpectation( 'promise', this.getPromiseExpectation() ),

        ];

    }

    static getObjectExpectations() {

        return [

            this.createObjectExpectation( 'promise', {

                promise: this.getPromiseExpectation(),

            } ),

        ];

    }

}
