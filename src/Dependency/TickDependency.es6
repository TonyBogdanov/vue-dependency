/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AbstractDependency from './AbstractDependency';

/**
 * Provides a dependency that is fulfilled on the supplied Vue component's next tick.
 *
 * The fulfilled value is a reference to the supplied Vue component.
 * This dependency never fails, it can only hang as pending.
 *
 * This can be useful when you want to ensure your component's view including all synchronous child components has
 * been stamped. As per the docs, the mounted() callback is NOT such a guarantee, hence the need for this dependency.
 */
export default class TickDependency extends AbstractDependency {

    static type = 'tick';

    constructor( name, component ) {

        super( name, new Promise( resolve => component.$nextTick( () => resolve( component ) ) ) );

    }

}
