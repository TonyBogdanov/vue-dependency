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

export default class AllDependencyValidator extends AbstractDependencyValidator {

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

            this.createArrayExpectation( 'all', this.getDefinitionsExpectation() ),

        ];

    }

    static getObjectExpectations() {

        return [

            this.createObjectExpectation( 'all', {

                dependencies: this.getDefinitionsExpectation(),

            } ),

        ];

    }

}
