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

The decorations are applied on the plain object level. However, the library is primarily designed to interoperate with:

- [Mongoose ODM](http://mongoosejs.com/)
- [node-sql](https://github.com/brianc/node-sql)

How?
----

### Install

	npm install sanitizr

### Usage

```js
// Example pending

```

### Errors
`DecoratorError: Attempting to decorate function type property 'property' is probably unintended!`

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
