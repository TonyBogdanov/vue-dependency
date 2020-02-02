/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AndExpectation from 'data-expectation/src/Expectation/AndExpectation';
import MapExpectation from 'data-expectation/src/Expectation/MapExpectation';
import NotExpectation from 'data-expectation/src/Expectation/NotExpectation';
import EmptyExpectation from 'data-expectation/src/Expectation/EmptyExpectation';
import StringExpectation from 'data-expectation/src/Expectation/StringExpectation';
import ValueExpectation from 'data-expectation/src/Expectation/ValueExpectation';
import CountExpectation from 'data-expectation/src/Expectation/CountExpectation';
import ArrayKeysExpectation from 'data-expectation/src/Expectation/ArrayKeysExpectation';

export default class AbstractDependencyValidator {

    static createArrayExpectation( name, ...args ) {

        return new AndExpectation(

            new CountExpectation( new ValueExpectation( 1 + args.length ) ),

            new MapExpectation( [

                new AndExpectation(

                    new NotExpectation( new EmptyExpectation() ),
                    new StringExpectation(),
                    new ValueExpectation( name )

                ),

                ...args

            ] )

        );

    }

    static createObjectExpectation( name, args = {} ) {

        args.type = new AndExpectation(

            new NotExpectation( new EmptyExpectation() ),
            new StringExpectation(),
            new ValueExpectation( name )

        );

        return new AndExpectation(

            new ArrayKeysExpectation( new ValueExpectation( Object.keys( args ).sort() ), true ),
            new MapExpectation( args )

        );

    }

}
