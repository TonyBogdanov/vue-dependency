/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AbstractDependencyValidator from './AbstractDependencyValidator';
import AndExpectation from 'data-expectation/src/Expectation/AndExpectation';
import ArrayExpectation from 'data-expectation/src/Expectation/ArrayExpectation';
import IndexedArrayExpectation from 'data-expectation/src/Expectation/IndexedArrayExpectation';
import ListExpectation from 'data-expectation/src/Expectation/ListExpectation';
import Validator from '../Validator';

export default class AnyDependencyValidator extends AbstractDependencyValidator {

    static getDefinitionsExpectation() {

        const listExpectation = new ListExpectation();
        Validator.expectationPostProcessors.push( () => {

            listExpectation.expectation = Validator.getDefinitionExpectation();

        } );

        return new AndExpectation(

            new ArrayExpectation(),
            new IndexedArrayExpectation(),
            listExpectation

        );

    }

    static getArrayExpectations() {

        return [

            this.createArrayExpectation( 'any', this.getDefinitionsExpectation() ),

        ];

    }

    static getObjectExpectations() {

        return [

            this.createObjectExpectation( 'any', {

                dependencies: this.getDefinitionsExpectation(),

            } ),

        ];

    }

}
