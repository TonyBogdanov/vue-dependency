/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Validator from './Util/Validator';

import isArray from 'data-types-js/src/is/isArray';
import isString from 'data-types-js/src/is/isString';

import StringExpectation from 'data-expectation/src/Expectation/StringExpectation';
import AndExpectation from 'data-expectation/src/Expectation/AndExpectation';
import NotExpectation from 'data-expectation/src/Expectation/NotExpectation';
import EmptyExpectation from 'data-expectation/src/Expectation/EmptyExpectation';
import MapExpectation from 'data-expectation/src/Expectation/MapExpectation';
import EnumExpectation from 'data-expectation/src/Expectation/EnumExpectation';
import AllDependency from './Dependency/AllDependency';
import AnyDependency from './Dependency/AnyDependency';
import ComponentDependency from './Dependency/ComponentDependency';
import FrameDependency from './Dependency/FrameDependency';
import ManualDependency from './Dependency/ManualDependency';
import PollDependency from './Dependency/PollDependency';
import PromiseDependency from './Dependency/PromiseDependency';
import RefDependency from './Dependency/RefDependency';
import TickDependency from './Dependency/TickDependency';
import ArrayExpectation from 'data-expectation/src/Expectation/ArrayExpectation';
import IndexedArrayExpectation from 'data-expectation/src/Expectation/IndexedArrayExpectation';
import AssociativeArrayExpectation from 'data-expectation/src/Expectation/AssociativeArrayExpectation';

export default class DependencyGraph {

    static map = {

        [ AllDependency.type ]:         AllDependency,
        [ AnyDependency.type ]:         AnyDependency,
        [ ComponentDependency.type ]:   ComponentDependency,
        [ FrameDependency.type ]:       FrameDependency,
        [ ManualDependency.type ]:      ManualDependency,
        [ PollDependency.type ]:        PollDependency,
        [ PromiseDependency.type ]:     PromiseDependency,
        [ RefDependency.type ]:         RefDependency,
        [ TickDependency.type ]:        TickDependency,

    };

    constructor( component ) {

        this.dependenciesValidator = new Validator( `Cannot register dependencies` );
        this.dependencyValidator = new Validator( `Cannot register dependency` );

        this.component = component;
        this.dependencies = {};

        this.invoked = false;
        this.sealed = false;

    }

    registerDependency( name, dependency ) {

        /* debug:start */
        if ( this.sealed ) {

            throw `Cannot register dependency, graph is sealed.`;

        }

        this.dependencyValidator.expect( name, 'invalid name', new AndExpectation(

            new NotExpectation( new EmptyExpectation() ),
            new StringExpectation(),
            new NotExpectation( new EnumExpectation( Object.keys( this.dependencies ) ) )

        ) );
        /* debug:end */

        if ( isString( dependency ) ) {

            return this.registerDependency( name, {

                type: ComponentDependency.type,
                options: [ this.component, dependency ],

            } );

        }

        if ( isArray( dependency ) ) {

            /* debug:start */
            this.dependencyValidator.expect( dependency, 'when an Array is supplied, it cannot be empty',
                new NotExpectation( new EmptyExpectation() ) );
            /* debug:end */

            return this.registerDependency( name, {

                type: dependency[0],
                options: dependency.slice( 1 ),

            } );

        }

        /* debug:start */
        this.dependencyValidator.expect( dependency, 'must be a String, Array or a valid Object', new AndExpectation(

            new NotExpectation( new EmptyExpectation() ),
            new AssociativeArrayExpectation(),
            new MapExpectation( {

                type: new AndExpectation(

                    new NotExpectation( new EmptyExpectation() ),
                    new StringExpectation(),
                    new EnumExpectation( Object.keys( DependencyGraph.map ) )

                ),

                options: new AndExpectation(

                    new ArrayExpectation(),
                    new IndexedArrayExpectation(),

                ),

            } )

        ) );
        /* debug:end */

        const provider = () => {

            const instance = new DependencyGraph.map[ dependency.type ]( name, ...( dependency.options || [] ) );
            instance.promise.then( this.seal.bind( this ), this.seal.bind( this ) );

            return instance;

        };

        /* debug:start */
        console.debug( 'Registering dependency:', name, DependencyGraph.map[ dependency.type ].type );
        /* debug:end */

        this.dependencies[ name ] = this.invoked ? provider() : provider;
        return this;

    }

    registerDependencies( dependencies ) {

        /* debug:start */
        if ( this.sealed ) {

            throw `Cannot register dependencies, graph is sealed.`;

        }

        this.dependenciesValidator.expect( dependencies, '', new AndExpectation(

            new ArrayExpectation(),
            new AssociativeArrayExpectation(),

        ) );
        /* debug:end */

        for ( const name in dependencies ) {

            if ( ! dependencies.hasOwnProperty( name ) ) {

                continue;

            }

            this.registerDependency( name, dependencies[ name ] );

        }

        return this;

    }

    invoke() {

        /* debug:start */
        if ( this.sealed ) {

            throw `Cannot invoke dependency graph, already sealed.`;

        }

        if ( this.invoked ) {

            throw `Cannot invoke dependency graph, already invoked.`;

        }

        console.debug( 'Invoking dependency graph' );
        /* debug:end */

        this.invoked = true;

        for ( const name in this.dependencies ) {

            if ( ! this.dependencies.hasOwnProperty( name ) ) {

                continue;

            }

            this.dependencies[ name ] = this.dependencies[ name ]();

        }

        return this;

    }

    seal() {

        console.warn( 'seal' );

        if ( this.sealed ) {

            return;

        }

        console.log( this.dependencies );

        const data = {};

        for ( const name in this.dependencies ) {

            if ( ! this.dependencies.hasOwnProperty( name ) ) {

                continue;

            }

            const dependency = this.dependencies[ name ];
            data[ name ] = dependency.value;

            if ( dependency.fulfilled ) {

                continue;

            }

            if ( dependency.failed ) {

                this.sealed = true;

                /* debug:start */
                console.debug( 'Sealed dependency graph (failed)', data );
                /* debug:end */

                return this;

            }

            console.warn( 'STILL PENDING', name, dependency );
            return this;

        }

        this.sealed = true;

        /* debug:start */
        console.debug( 'Sealed dependency graph (fulfilled)', data );
        /* debug:end */

        return this;

    }

}
