"use strict";

var _           = require( "lodash" );
var HelperError = require( "../error/helper" );
var TypeInfo    = require( "./info.js" );

module.exports = TypeHelper;

/**
 * Construct a new instance of a TypeHelper.
 * @param {TypeInfo} typeInfo The type information instance for the type of the instance.
 * @constructor
 */
function TypeHelper( typeInfo ) {
	this.typeInfo = typeInfo;
}

/**
 * Removes fields from an instance which are set to null.
 * @param {Object|Object[]} instance The instance of the type on which operations should be performed.
 * @param {Boolean} [clone=false] Should the operation be performed on a copy of the instance instead?
 * @returns {*} The instance with the null fields removed.
 */
TypeHelper.prototype.omitNull = function TypeHelper$omitNull( instance, clone ) {
	if( !instance ) {
		return instance;
	}
	var targetInstance = clone ? _.clone( instance ) : instance;

	// Handle arrays.
	if( Array.isArray( instance ) ) {
		var self = this;

		//noinspection UnnecessaryLocalVariableJS
		var results = instance.map( function withoutNullValues( element ) {
			return self.omitNull( element, clone );
		} );
		return results;
	}

	// Handle generic objects.
	for( var propertyName in targetInstance ) {
		// If the property is marked null, delete it.
		if( targetInstance[ propertyName ] === null ) {
			delete targetInstance[ propertyName ];
			continue;
		}

		// If the property is marked complex...
		if( this.typeInfo.isComplex( propertyName ) ) {
			// ...retrieve the name of the referenced type...
			var complexTypeName = this.typeInfo.complex( propertyName );
			// ...and then retrieve the type itself.
			var complexType     = TypeInfo.types[ complexTypeName ];
			if( complexType ) {
				// Omit the hidden members of the complex type from the target instance.
				complexType.typehelper.omitNull( targetInstance[ propertyName ], false );
			} else {
				throw new HelperError( "Property '" + propertyName + "' marked as complex, referencing '" + complexTypeName + "', but the type is unknown." );
			}
		}
	}
	return targetInstance;
};

/**
 * Removes hidden fields from an instance of the type.
 * @param {Object|Object[]} instance The instance of the type on which operations should be performed.
 * @param {String} [userClass="user"] The user class for which to check the hidden attribute.
 * @param {Boolean} [clone=false] Should the operation be performed on a copy of the instance instead?
 * @returns {*} The instance with the hidden fields removed.
 */
TypeHelper.prototype.omitHidden = function TypeHelper$omitHidden( instance, userClass, clone ) {
	if( !instance ) {
		return instance;
	}
	userClass          = "undefined" === typeof userClass ? TypeInfo.USERCLASS_USER : userClass;
	var targetInstance = clone ? _.clone( instance ) : instance;

	// Handle arrays.
	if( Array.isArray( instance ) ) {
		var self = this;

		//noinspection UnnecessaryLocalVariableJS
		var results = instance.map( function withoutHidden( element ) {
			return self.omitHidden( element, userClass, clone );
		} );
		return results;
	}

	if( this.typeInfo.typeInfo.hasOwnProperty( "__ROOT__" ) ) {
		if( this.typeInfo.isHidden( "__ROOT__", userClass ) ) {
			return null;
		}
	}

	// Handle generic objects.
	for( var propertyName in targetInstance ) {
		if( !this.typeInfo.typeInfo.hasOwnProperty( propertyName ) ) {
			continue;
		}

		// If the property is marked hidden, delete it.
		if( this.typeInfo.isHidden( propertyName, userClass ) ) {
			delete targetInstance[ propertyName ];
			continue;
		}

		// If the property is marked complex...
		if( this.typeInfo.isComplex( propertyName ) ) {
			// ...retrieve the name of the referenced type...
			var complexTypeName = this.typeInfo.complex( propertyName );
			// ...and then retrieve the type itself.
			var complexType     = TypeInfo.types[ complexTypeName ];
			if( complexType ) {
				// Omit the hidden members of the complex type from the target instance.
				complexType.typehelper.omitHidden( targetInstance[ propertyName ], userClass, false );
			} else {
				throw new HelperError( "Property '" + propertyName + "' marked as complex, referencing '" + complexTypeName + "', but the type is unknown." );
			}
		}
	}
	return targetInstance;
};

/**
 * Removes read-only fields from an instance of the type.
 * @param {Object|Object[]} instance The instance of the type on which operations should be performed.
 * @param {String} [userClass="user"] The user class for which to check the readonly attribute.
 * @param {Boolean} [clone=false] Should the operation be performed on a copy of the instance instead?
 * @returns {*} The instance with the read-only fields removed.
 */
TypeHelper.prototype.omitReadOnly = function TypeHelper$omitReadOnly( instance, userClass, clone ) {
	if( !instance ) {
		return instance;
	}
	userClass          = "undefined" === typeof userClass ? TypeInfo.USERCLASS_USER : userClass;
	var targetInstance = clone ? _.clone( instance ) : instance;

	// Handle arrays.
	if( Array.isArray( instance ) ) {
		var self = this;

		//noinspection UnnecessaryLocalVariableJS
		var results = instance.map( function withoutReadOnly( element ) {
			return self.omitReadOnly( element, userClass, clone );
		} );
		return results;
	}

	if( this.typeInfo.typeInfo.hasOwnProperty( "__ROOT__" ) ) {
		if( this.typeInfo.isReadOnly( "__ROOT__", userClass ) ) {
			return null;
		}
	}

	// Handle generic objects.
	for( var propertyName in targetInstance ) {
		if( !this.typeInfo.typeInfo.hasOwnProperty( propertyName ) ) {
			continue;
		}

		// / If the property is marked read-only, remove it from the instance.
		if( this.typeInfo.isReadOnly( propertyName, userClass ) ) {
			delete targetInstance[ propertyName ];
			continue;
		}

		// If the property is marked as complex...
		if( this.typeInfo.isComplex( propertyName ) ) {
			// ...retrieve the name of the referenced type...
			var complexTypeName = this.typeInfo.complex( propertyName );
			// ...and then retrieve the type itself.
			var complexType     = TypeInfo.types[ complexTypeName ];
			if( complexType ) {
				// Omit the read-only members of the complex type from the target instance.
				complexType.typehelper.omitReadOnly( targetInstance[ propertyName ], userClass, false );
			} else {
				throw new HelperError( "Property '" + propertyName + "' marked as complex, referencing '" + complexTypeName + "', but the type is unknown." );
			}
		}
	}
	return targetInstance;
};

/**
 * Replaces concealed fields from an instance of the type.
 * @param {Object|Object[]} instance The instance of the type on which operations should be performed.
 * @param {String} [userClass="user"] The user class for which to check the concealed attribute.
 * @param {Boolean} [clone=false] Should the operation be performed on a copy of the instance instead?
 * @param {*} [concealWith=true] The value to replace the original value with.
 * @returns {*} The instance with the concealed fields replaced.
 */
TypeHelper.prototype.conceal = function TypeHelper$conceal( instance, userClass, clone, concealWith ) {
	if( !instance ) {
		return instance;
	}
	userClass          = "undefined" === typeof userClass ? TypeInfo.USERCLASS_USER : userClass;
	concealWith        = "undefined" === typeof concealWith ? true : concealWith;
	var targetInstance = clone ? _.clone( instance ) : instance;

	// Handle arrays.
	if( Array.isArray( instance ) ) {
		var self = this;

		//noinspection UnnecessaryLocalVariableJS
		var results = instance.map( function concealed( element ) {
			return self.conceal( element, userClass, clone, concealWith );
		} );
		return results;
	}

	if( this.typeInfo.typeInfo.hasOwnProperty( "__ROOT__" ) ) {
		if( this.typeInfo.isConcealed( "__ROOT__", userClass ) ) {
			return {};
		}
	}

	// Handle generic objects.
	for( var propertyName in targetInstance ) {
		if( !this.typeInfo.typeInfo.hasOwnProperty( propertyName ) ) {
			continue;
		}

		// If the property is marked as concealed, conceal it.
		if( this.typeInfo.isConcealed( propertyName, userClass ) ) {
			targetInstance[ propertyName ] = concealWith;
		}
		// If the property is marked as complex...
		if( this.typeInfo.isComplex( propertyName ) ) {
			// ...retrieve the name of the referenced type...
			var complexTypeName = this.typeInfo.complex( propertyName );
			// ...and then retrieve the type itself.
			var complexType     = TypeInfo.types[ complexTypeName ];
			if( complexType ) {
				// Conceal the concealed members of the complex type in the target instance.
				complexType.typehelper.conceal( targetInstance[ propertyName ], userClass, false, concealWith );
			} else {
				throw new HelperError( "Property '" + propertyName + "' marked as complex, referencing '" + complexTypeName + "', but the type is unknown." );
			}
		}
	}
	return targetInstance;
};

/**
 * Replaces complex type instances with their ID.
 * @param {Object|Object[]} instance The instance of the type on which operations should be performed.
 * @param {Boolean} [clone=false] Should the operation be performed on a copy of the instance instead?
 * @returns {*} The instance with the complex fields replaced.
 */
TypeHelper.prototype.reduceComplex = function TypeHelper$reduceComplex( instance, clone ) {
	if( !instance ) {
		return instance;
	}
	var targetInstance = clone ? _.clone( instance ) : instance;

	// Handle arrays.
	if( Array.isArray( instance ) ) {
		var self = this;

		//noinspection UnnecessaryLocalVariableJS
		var results = instance.map( function withComplexReduced( element ) {
			return self.reduceComplex( element, clone );
		} );
		return results;
	}

	for( var propertyName in targetInstance ) {
		if( this.typeInfo.isComplex( propertyName ) ) {
			targetInstance[ propertyName ] = reduceObject( targetInstance[ propertyName ] );
		}
	}

	return targetInstance;

	function reduceObject( entity ) {
		if( Array.isArray( entity ) ) {
			return entity.map( reduceObject );
		}

		if( !( "id" in entity ) ) {
			throw new HelperError( "The property can't be reduced as it has no 'id' property itself." );
		}

		return entity.id;
	}
};


