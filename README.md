sanitizr
========
[![Build Status](https://travis-ci.org/oliversalzburg/sanitizr.svg?branch=master)](https://travis-ci.org/oliversalzburg/sanitizr)
[![Coverage Status](https://coveralls.io/repos/oliversalzburg/sanitizr/badge.svg?branch=master&service=github)](https://coveralls.io/github/oliversalzburg/sanitizr?branch=master)
[![Code Climate](https://codeclimate.com/github/oliversalzburg/sanitizr/badges/gpa.svg)](https://codeclimate.com/github/oliversalzburg/sanitizr)
![GitHub license](https://img.shields.io/github/license/oliversalzburg/sanitizr.svg)

What?
-----
Sanitizr is an entity sanitation framework.

It allows to decorate a type description with annotations that can later be used to apply transformations on instances
of the described type.

The annotations are applied on the plain object level. However, the library is primarily designed to interoperate with:

- [Mongoose ODM](http://mongoosejs.com/)
- [node-sql](https://github.com/brianc/node-sql)

To put it simply, in your application, you will have a description of a type. In mongoose, this type comes from a *schema*.
If you're using node-sql, you're going to have a table definition that you pass to `sql.define`.

sanitizr attempts to re-use that data structure and put additional, hidden information into it. That information can later
be used to remove or replace certain properties from an instance of that type.

This allows you to pull an instance of that type from your database and then process it depending on the user class that
requested the entity.

For example, you might annotate a single property to be hidden for the "user" user class. If the user has the "admin"
user class, he would see the property. If the user has the "user" user class, he won't.

How?
----

### Install

	npm install sanitizr

### Usage

#### node-sql

In node-sql, a complete type setup would look like this:

```js
var sanitizr = require( "sanitizr" );
var sql      = require( "sql" ).setDialect( "postgres" );

var schema = {
	name    : "person",
	columns : [
		"id",
		"name",
		"apiKey"
	]
};
var type = sql.define( schema );

sanitizr
	.decorate( type )
	.decorate( "name", sanitizr.USERCLASS_USER, sanitizr.READ_ONLY )
	.decorate( "apiKey", sanitizr.USERCLASS_USER, sanitizr.HIDDEN );
	
var info   = sanitizr.info( schema.name, type );
var helper = sanitizr.helper( info );
```

When you *receive* an entity from a user, you can remove the read-only properties with:

```js
var cleanPerson = helper.omitReadOnly( personFromUser );
```

When you want to *send* an entity to a user, you can remove hidden properties with:
 
 ```js
 var cleanPerson = helper.omitHidden( personForUser );
 ```


#### mongoose

```js
// Example pending
```

### Concepts

1. sanitizr has 2 user classes pre-defined:
	- *admin* as `USERCLASS_ADMIN` 
	- *user* as `USERCLASS_USER` 

	The classes are just strings, feel free to use anything else.

2. The *helper* has the following core methods:
	- `omitNull` - removes all properties that are `null`.
	- `omitHidden` - removes all properties that are marked `HIDDEN`.
	- `omitReadOnly` - removes all properties that are marked `READ_ONLY`.
	- `conceal` - replaces the values of all properties that are marked `CONCEALED` with `true`.

3. In sanitizr, a type may be referred to as *complex*. This simply means that it is not a primitive, like a `String`,
	but another type, which is composed of primitives or other complex objects.

	If a property is *complex*, omissions and concealment will be applied by the rules of the referenced, complex type.

	Additionally, the *helper* provides the following utility method to handle complex properties:
	- `reduceComplex` - replaces the values of all properties that are *complex*, with the `id` property of the 
		referenced object.

Errors
------
### `DecoratorError: Attempting to decorate function type property 'property' is probably unintended!`

The error is thrown for mongoose schemas that use the built-in constructors as type identifiers. For example:  

```js
var schema = {
	property : String
}
```

Here, `property` uses the constructor `String` to identify the type. This is not supported, because decorations would be
placed on an object that is shared with other properties. Also, this would modify a commonly used type, which is just as
bad.

Instead, use the `type` property in a new object, to describe the type of the property:

```js
var schema = {
	property : { type : String }
}
```

### `HelperError: The property can't be reduced as it has no 'id' property itself.`

The error is thrown when an attempt is made to invoke `reduceComplex` on a property that does not have an `id` member.

```js
// We define a new type and mark the "parent" property as complex.
var personType = { parent : {} };
var typeInfo   = new TypeInfo( "person", personType );
typeInfo.markComplex( "parent", "person" );

// Construct the helper for the type.
var helper = new TypeHelper( typeInfo );

// This "instance" of the type described above has a "parent" property, but that property itself has no "id" property.
// This means we can't reduce the object to an id and reduceComplex will throw.
var personInstance = { parent : {} };

helper.reduceComplex( personInstance );

```
