angular.module('labs.typeahead',[]);
angular.module('labs.typeahead')
.directive('typeahead', ['$parse', function($parse){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: true, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs, $transclude) {
			var label = $parse($attrs.labelKey || 'label');
			
			$scope.select = function(item) {
				$scope.$parent[$scope.modelName] = item;
				$scope.model.$setViewValue(label(item));
				$scope.$apply();
			}
		},
		require: '?ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<input type="text" class="labs-typeahead"><ol class="labs-typeahead-list" style="display:none;"><li class="labs-typeahead-loading">Loading!</li><li class="labs-typeahead-empty">No Results!</li><li class="labs-typeahead-list-item" ng-transclude></li></ol>',
		// templateUrl: '',
		// replace: true,
		transclude: true,
		compile: function (tElement, tAttrs) {
			var rpt = document.createAttribute('ng-repeat');
			var mdl = document.createAttribute('ng-model');
			var load = document.createAttribute('ng-show');
			var empty = document.createAttribute('ng-show');

			//parse repeat sentence
			var listArray = tAttrs.list.split(' ');
			var listVal ='';
			var newRepeat = '';
			var isLoading = tAttrs.isLoading || false;

			for (var i = 0; i < listArray.length; i++) {
				newRepeat += listArray[i] + ' ';
				if (listArray[i] == 'in') {
					newRepeat += 'filtered = (';
				}
			}
			newRepeat += ')';

			//parse repeat sentence filteredItems  = (items | filter:keyword)
			rpt.nodeValue = newRepeat;
			mdl.nodeValue = tAttrs.ngModel;
			load.nodeValue = isLoading;
			empty.nodeValue = 'filtered.length == 0 && !isLoading';

			tElement.removeClass(tAttrs.class);
			tElement.find('.labs-typeahead').addClass(tAttrs.class)[0].attributes.setNamedItem(mdl);
			tElement.find('li.labs-typeahead-loading')[0].attributes.setNamedItem(load);
			tElement.find('li.labs-typeahead-empty')[0].attributes.setNamedItem(empty);
			tElement.find('li.labs-typeahead-list-item')[0].attributes.setNamedItem(rpt);
			return function (scope, element, attr, ngModel) {
				
				scope.input = element.find('input.labs-typeahead');
				scope.listEl = element.find('ol.labs-typeahead-list');
				scope.model = ngModel;
				scope.modelName = attr.ngModel;
				element.find('.labs-typeahead').on('focus',function (event) {
					scope.listEl.show();
				});
				element.find('.labs-typeahead').on('blur',function (event) {
					scope.listEl.hide();
				});
				element.find('.labs-typeahead').on('keydown', $.proxy(function (event) {
					angular.element(this.currentItem).removeClass('labs-typeahead-selected');
					if (scope.filtered.length == 0) {
						return;
					}
					//27 == escape
					if (event.keyCode === 27) {
						//close
						this.listEl.hide();
					}
					//40 == down arrow
					else if (event.keyCode === 40) {
						this.listEl.show();
						if (!this.currentItem) {
							this.currentItem = angular.element(this.listEl.children()[2]);
						}
						else {
							this.currentItem = angular.element(this.currentItem).next().length ? angular.element(this.currentItem).next() : angular.element(this.listEl.children()[2]);
						}
						//open if closed
						//move down list
					}
					//38 == up arrow
					else if (event.keyCode === 38) {
						//move up list
						this.listEl.show();
						if (!this.currentItem) {
							this.currentItem = angular.element(this.listEl.children()[this.listEl.children().length-1]);
						}
						else {
							if (!angular.element(this.currentItem).prev().hasClass('labs-typeahead-list-item')) {
								this.currentItem = angular.element(this.listEl.children()[this.listEl.children().length-1]);
							}
							else {
								this.currentItem = angular.element(this.currentItem).prev();
							} 
						}
					}
					else {
						//any other key is pressed
						this.listEl.show();

					}
					if (this.currentItem) {
						this.currentItem.addClass('labs-typeahead-selected');
					}
					//13 == enter 9 == tab
					if (event.keyCode === 13 || event.keyCode === 9) {
						//select list
						scope.select(angular.element(this.currentItem).scope().item);
						
						scope.listEl.hide();
					}
				},scope));

				element.find('.labs-typeahead-list').on('click', 'li.labs-typeahead-list-item', function (event) {
					scope.currentItem = angular.element(this);
					scope.select(scope.currentItem.scope().item);
					scope.listEl.hide();
				}).on('mouseover', 'li.labs-typeahead-list-item', function (event) {
					angular.element(scope.currentItem).removeClass('labs-typeahead-selected');
					scope.currentItem = angular.element(this);
					scope.currentItem.addClass('labs-typeahead-selected');
				}).on('mousedown', function (event) {
					event.preventDefault();
					event.stopImmediatePropagation();
				});
				
				//cleanup events when elements are removed
				element.on('$destroy', function (event) {
					element.find('labs-typeahead').off();
					element.find('labs-typeahead-list').off();
				})
			}
		}
	};
}]);