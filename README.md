# ng-labs-typeahead

Version 0.1

##Getting Started

* include files ng-labs-typeahead.js/css
* include module 'labs.typeahead'

```
angular.module('myApp', ['labs.typeahead'])
```

* use the ```<typeahead>``` element in your html

```
<typeahead ng-model="selected" list="object in array | filter:{label:selected}" is-loading="someBoolean" label-key="someString">
in here is your template for the typeahead items {{object.name}}
</typeahead>
```

##Options 

* ng-model (__reqired__): the selected object to be created in the current scope.
  * Also note the name of this attribute is also used as the current string in the typeahead. So when you filter you use the same name as the model to filter the list
* list (__reqired__): *ng-repeat sentence*
  * 'object in array | filter:something'
  * does not currently work with track by
  * object is passed through to the transcluded element
* is-loading (__optional__): *boolean* (defaults to false) determines if the loading list element should show. (For now this is not self managed)
* label-key (__optional__): *string* (defaults to 'label') is used to interrogate the object in the list for what to display in the text input