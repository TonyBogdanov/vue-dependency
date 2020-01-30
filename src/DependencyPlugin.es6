/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Component from './Mixin/Component';

/**
 * Enable the plugin by calling Vue.use( DependencyPlugin.plugin ).
 */
export default class DependencyPlugin {

    static get plugin() {

        return {

            install( Vue ) {

                Vue.mixin( Component.mixin );

            }

        };

    }

}
