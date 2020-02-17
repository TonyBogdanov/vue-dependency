/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AndExpectation from 'data-expectation/src/Expectation/AndExpectation';
import ArrayExpectation from 'data-expectation/src/Expectation/ArrayExpectation';
import AssociativeArrayExpectation from 'data-expectation/src/Expectation/AssociativeArrayExpectation';
import ArrayKeysExpectation from 'data-expectation/src/Expectation/ArrayKeysExpectation';
import ListExpectation from 'data-expectation/src/Expectation/ListExpectation';
import NotExpectation from 'data-expectation/src/Expectation/NotExpectation';
import EmptyExpectation from 'data-expectation/src/Expectation/EmptyExpectation';
import StringExpectation from 'data-expectation/src/Expectation/StringExpectation';
import IndexedArrayExpectation from 'data-expectation/src/Expectation/IndexedArrayExpectation';
import OrExpectation from 'data-expectation/src/Expectation/OrExpectation';
import RefDependencyValidator from './Validator/RefDependencyValidator';
import TickDependencyValidator from './Validator/TickDependencyValidator';
import PromiseDependencyValidator from './Validator/PromiseDependencyValidator';
import PollDependencyValidator from './Validator/PollDependencyValidator';
import ManualDependencyValidator from './Validator/ManualDependencyValidator';
import FrameDependencyValidator from './Validator/FrameDependencyValidator';
import ComponentDependencyValidator from './Validator/ComponentDependencyValidator';
import AnyDependencyValidator from './Validator/AnyDependencyValidator';
import AllDependencyValidator from './Validator/AllDependencyValidator';
import WatchDependencyValidator from './Validator/WatchDependencyValidator';

class Validator {

    static getStringDefinitionExpectation() {

        if ( ! this.stringDefinitionExpectation ) {

            this.stringDefinitionExpectation = new AndExpectation(

                new NotExpectation( new EmptyExpectation() ),
                new StringExpectation()

            );

        }

        return this.stringDefinitionExpectation;

    }

    static getArrayDefinitionExpectation() {

        if ( ! this.arrayDefinitionExpectation ) {

            this.arrayDefinitionExpectation = new AndExpectation(

                new ArrayExpectation(),
                new IndexedArrayExpectation(),
                new OrExpectation(

                    ...AllDependencyValidator.getArrayExpectations(),
                    ...AnyDependencyValidator.getArrayExpectations(),
                    ...ComponentDependencyValidator.getArrayExpectations(),
                    ...FrameDependencyValidator.getArrayExpectations(),
                    ...ManualDependencyValidator.getArrayExpectations(),
                    ...PollDependencyValidator.getArrayExpectations(),
                    ...PromiseDependencyValidator.getArrayExpectations(),
                    ...RefDependencyValidator.getArrayExpectations(),
                    ...TickDependencyValidator.getArrayExpectations(),
                    ...WatchDependencyValidator.getArrayExpectations()

                )

            );

            while ( 0 < this.expectationPostProcessors.length ) {

                this.expectationPostProcessors.shift()();

            }

        }

        return this.arrayDefinitionExpectation;

    }

    static getObjectDefinitionExpectation() {

        if ( ! this.objectDefinitionExpectation ) {

            this.objectDefinitionExpectation = new AndExpectation(

                new ArrayExpectation(),
                new AssociativeArrayExpectation(),
                new OrExpectation(

                    ...AllDependencyValidator.getObjectExpectations(),
                    ...AnyDependencyValidator.getObjectExpectations(),
                    ...ComponentDependencyValidator.getObjectExpectations(),
                    ...FrameDependencyValidator.getObjectExpectations(),
                    ...ManualDependencyValidator.getObjectExpectations(),
                    ...PollDependencyValidator.getObjectExpectations(),
                    ...PromiseDependencyValidator.getObjectExpectations(),
                    ...RefDependencyValidator.getObjectExpectations(),
                    ...TickDependencyValidator.getObjectExpectations(),
                    ...WatchDependencyValidator.getObjectExpectations()

                )

            );

        }

        return this.objectDefinitionExpectation;

    }

    static getDefinitionExpectation() {

        if ( ! this.definitionExpectation ) {

            this.definitionExpectation = new OrExpectation(

                this.getStringDefinitionExpectation(),
                this.getArrayDefinitionExpectation(),
                this.getObjectDefinitionExpectation()

            );

        }

        return this.definitionExpectation;

    }

    static getDefinitionsExpectation() {

        if ( ! this.definitionsExpectation ) {

            this.definitionsExpectation = new AndExpectation(

                new ArrayExpectation(),
                new AssociativeArrayExpectation(),
                new ArrayKeysExpectation( new ListExpectation( new AndExpectation(

                    new NotExpectation( new EmptyExpectation() ),
                    new StringExpectation()

                ) ) ),
                new ListExpectation( this.getDefinitionExpectation() )

            );

        }

        return this.definitionsExpectation;

    }

}

Validator.expectationPostProcessors = [];

export default Validator;
