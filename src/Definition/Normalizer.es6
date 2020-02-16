/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import isString from 'data-types-js/src/is/isString';
import isArray from 'data-types-js/src/is/isArray';

import ComponentName from '../Util/ComponentName';
import Validator from './Validator';
import TickDependency from '../Dependency/TickDependency';
import AllDependency from '../Dependency/AllDependency';
import AnyDependency from '../Dependency/AnyDependency';
import ComponentDependency from '../Dependency/ComponentDependency';
import RefDependency from '../Dependency/RefDependency';
import PromiseDependency from '../Dependency/PromiseDependency';
import PollDependency from '../Dependency/PollDependency';
import ManualDependency from '../Dependency/ManualDependency';
import FrameDependency from '../Dependency/FrameDependency';
import DefinitionMap from './DefinitionMap';

/**
 * Validates and normalizes dependency definition maps into DefinitionMap instances ready for use by the
 * dependency graph.
 *
 * Example: await new Normalizer( vm ).normalizeDefinitions( { name: definition } ).
 */
export default class Normalizer {

    constructor( vm ) {

        this.vm = vm;

    }

    normalizeDefinition( name, definition ) {

        if ( isString( definition ) ) {

            return () => new ComponentDependency( name, this.vm, definition );

        }

        if ( isArray( definition ) ) {

            switch ( definition[0] ) {

                case 'all':
                    return () => new AllDependency( name, ...definition[1].map( definition =>
                        this.normalizeDefinition( '', definition ) ) );

                case 'any':
                    return () => new AnyDependency( name, ...definition[1].map( definition =>
                        this.normalizeDefinition( '', definition ) ) );

                case 'component':

                    if ( definition.hasOwnProperty( 3 ) ) {

                        return () => new ComponentDependency( name, this.vm, definition[1], definition[2], definition[3] );

                    } else if ( definition.hasOwnProperty( 2 ) ) {

                        return () => new ComponentDependency( name, this.vm, definition[1], definition[2] );

                    }

                    return () => new ComponentDependency( name, this.vm, definition[1] );

                case 'frame':
                    return () => new FrameDependency( name );

                case 'manual':
                    return () => new ManualDependency( name );

                case 'poll':

                    if ( definition.hasOwnProperty( 3 ) ) {

                        return () => new PollDependency( name, this.vm, definition[1], definition[2], definition[3] );

                    } else if ( definition.hasOwnProperty( 2 ) ) {

                        return () => new PollDependency( name, this.vm, definition[1], definition[2] );

                    }

                    return () => new PollDependency( name, this.vm, definition[1] );

                case 'promise':
                    return () => new PromiseDependency( name, definition[1]() );

                case 'ref':

                    if ( definition.hasOwnProperty( 3 ) ) {

                        return () => new RefDependency( name, this.vm, definition[1], definition[2], definition[3] );

                    } else if ( definition.hasOwnProperty( 2 ) ) {

                        return () => new RefDependency( name, this.vm, definition[1], definition[2] );

                    }

                    return () => new RefDependency( name, this.vm, definition[1] );

                case 'tick':
                    return () => new TickDependency( name, this.vm );

            }

        }

        switch ( definition.type ) {

            case 'all':
                return () => new AllDependency( name, ...definition.dependencies.map( definition =>
                    this.normalizeDefinition( '', definition ) ) );

            case 'any':
                return () => new AnyDependency( name, ...definition.dependencies.map( definition =>
                    this.normalizeDefinition( '', definition ) ) );

            case 'component':

                if ( definition.hasOwnProperty( 'pollLimit' ) ) {

                    return () => new ComponentDependency( name, this.vm, definition.ref, definition.pollInterval,
                        definition.pollLimit );

                } else if ( definition.hasOwnProperty( 'pollInterval' ) ) {

                    return () => new ComponentDependency( name, this.vm, definition.ref, definition.pollInterval );

                }

                return () => new ComponentDependency( name, this.vm, definition.ref );

            case 'frame':
                return () => new FrameDependency( name );

            case 'manual':
                return () => new ManualDependency( name );

            case 'poll':

                if ( definition.hasOwnProperty( 'limit' ) ) {

                    return () => new PollDependency( name, definition.callback, definition.falsyValue, definition.interval,
                        definition.limit );

                } else if ( definition.hasOwnProperty( 'interval' ) ) {

                    return () => new PollDependency( name, definition.callback, definition.falsyValue, definition.interval );

                }

                return () => new PollDependency( name, definition.callback, definition.falsyValue );

            case 'promise':
                return () => new PromiseDependency( name, definition.promise() );

            case 'ref':

                if ( definition.hasOwnProperty( 'pollLimit' ) ) {

                    return () => new RefDependency( name, this.vm, definition.ref, definition.pollInterval,
                        definition.pollLimit );

                } else if ( definition.hasOwnProperty( 'pollInterval' ) ) {

                    return () => new RefDependency( name, this.vm, definition.ref, definition.pollInterval );

                }

                return () => new RefDependency( name, this.vm, definition.ref );

            case 'tick':
                return () => new TickDependency( name, this.vm );

        }

        /* vue_dependency_strict:start */
        throw [

            'Cannot resolve dependency definition %s for component %s, provided data is invalid.',
            ComponentName.get( this.vm ),
            name,

        ];
        /* vue_dependency_strict:end */

    }

    async normalizeDefinitions( definitions ) {

        if ( definitions instanceof Promise ) {

            /* vue_dependency_strict:start */
            try {
            /* vue_dependency_strict:end */

                definitions = await definitions;

            /* vue_dependency_strict:start */
            } catch ( error ) {

                throw [

                    'Cannot normalize dependency definitions for component %s provided as a Promise, because it' +
                    ' was rejected.',
                    ComponentName.get( this.vm ),
                    error,

                ];

            }
            /* vue_dependency_strict:end */

        }

        /* vue_dependency_strict:start */
        try {

            Validator.getDefinitionsExpectation().expect( definitions );

        } catch ( error ) {

            throw [

                'Cannot normalize dependency definitions for component %s, provided data is invalid.',
                ComponentName.get( this.vm ),
                error.message,
                definitions

            ];

        }
        /* vue_dependency_strict:end */

        const map = {};

        for ( const name in definitions ) {

            if ( ! definitions.hasOwnProperty( name ) ) {

                continue;

            }

            map[ name ] = this.normalizeDefinition( name, definitions[ name ] );

        }

        return new DefinitionMap( map );

    }

}
