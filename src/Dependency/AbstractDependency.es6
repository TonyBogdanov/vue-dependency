/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Debug from '../Util/Debug';

/**
 * Provides an abstract base for all types of dependencies.
 * Accepts a promise, the result of which will determine the fulfilment of the dependency.
 *
 * Use this.state to check the current state of the dependency, TRUE means fulfilled, FALSE means failed and NULL means
 * pending.
 *
 * Use this.value to retrieve the current value of the dependency, it will hold the result of fulfilment or the error
 * of failure. While the dependency is pending, the value will be NULL.
 *
 * Call this.promise to retrieve a promise controlled by the dependency (resolved on fulfilment & rejected on failure).
 * The promise both resolves and rejects with a reference to this dependency instance.
 *
 * You can also use this.fulfilled, this.failed & this.pending as shortcut checks of the state.
 *
 * All properties starting with an underscore are internal and should be ignored!
 */
export default class AbstractDependency {

    get promise() {

        if ( true === this.state ) {

            return Promise.resolve( this );

        }

        if ( false === this.state ) {

            return Promise.reject( this );

        }

        return new Promise( ( resolve, reject ) => {

            this._resolvers.push( resolve );
            this._rejectors.push( reject );

        } );

    }

    get fulfilled() {

        return true === this.state;

    }

    get failed() {

        return false === this.state;

    }

    get pending() {

        return null === this.state;

    }

    constructor( name, promise ) {

        this.name = name;

        this.state = null;
        this.value = null;

        this._resolvers = [];
        this._rejectors = [];

        if ( promise instanceof Promise ) {

            promise.then( this.fulfil.bind( this ), this.fail.bind( this ) );

        }

    }

    fulfil( value ) {

        if ( null !== this.state ) {

            return this;

        }

        this.state = true;
        this.value = value;

        /* debug:start */
        Debug.debug( 'Dependency fulfilled', this );
        /* debug:end */

        this._resolvers.forEach( resolve => resolve( this ) );
        return this;

    }

    fail( value ) {

        if ( null !== this.state ) {

            return this;

        }

        this.state = false;
        this.value = value;

        /* debug:start */
        Debug.debug( 'Dependency failed', this );
        /* debug:end */

        this._rejectors.forEach( reject => reject( this ) );
        return this;

    }

}
