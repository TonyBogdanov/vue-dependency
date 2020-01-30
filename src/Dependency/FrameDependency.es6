/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import AbstractDependency from './AbstractDependency';

/**
 * Provides a dependency that is fulfilled before the next browser repaint.
 *
 * The fulfilled value is a https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp
 * This dependency never fails, it can only hang as pending.
 *
 * This can be useful when you want to ensure that a single frame has passed since the creation of the dependency.
 */
export default class FrameDependency extends AbstractDependency {

    static type = 'frame';

    constructor( name ) {

        super( name, new Promise( resolve => requestAnimationFrame( resolve ) ) );

    }

}
