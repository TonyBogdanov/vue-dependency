/*
 * Copyright (c) Tony Bogdanov <tonybogdanov@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// Mock DOM.
require( 'jsdom-global' )();

// Disable debug logging.
console.debug = () => {};

// Mock requestAnimationFrame.
requestAnimationFrame = callback => setTimeout( () => callback( '__raf__' ), 16 );

module.exports = {

    extension: [ 'es6' ],

};
