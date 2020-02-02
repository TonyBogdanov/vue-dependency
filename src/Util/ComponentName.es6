/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class ComponentName {

    static get( vm ) {

        if ( vm.$options.hasOwnProperty( 'name' ) ) {

            return vm.$options.name;

        }

        if ( vm.$options.hasOwnProperty( '_componentTag' ) ) {

            return vm.$options._componentTag;

        }

        return '?';

    }

}
