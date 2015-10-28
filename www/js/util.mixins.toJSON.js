window.FongPhone = window.FongPhone || {};
window.FongPhone.Utils = window.FongPhone.Utils || {};
window.FongPhone.Utils.Mixins = window.FongPhone.Utils.Mixins || {};

window.FongPhone.Utils.Mixins.ToJSON = {
	/**
	 * applyMixin
	 * @param obj -> The object to extend
	 * @param exclusionList -> List of explicit attributes to filter out
	 * @returns {*} -> A a safe representation that can be serialized as json
	 */
	applyMixin: function(obj, exclusionList) {
		exclusionList = exclusionList || [];
		var exclusionMap = {
			$scope: true // also filter out scope
		};
		_.each(exclusionList, function(k) {
			exclusionMap[k] = true;
		});

		return _.extend(obj, {
			toJSON: function() {
				var obj = {};
				_.each(this, function(val, key) {
					if (!_excluded(val, key)) {
						if (_.isArray(val)) {
							obj[key] = [];
							_.each(val, function(entry) {
							   obj[key].push(entry.toJSON ? entry.toJSON() : entry);
							});
						} else {
							obj[key] = (val && val.toJSON) ? val.toJSON() : val;
						}
					}
				});

				/*
					exclude angular attributes prefixed with $,
					exclude private members prefixed with underscore
					exclude anything explicitly specified
					exclude functions
				 */
				function _excluded(val, key) {
					return (key[0] === '$') ||
						(key[0] === '_') ||
						!!(exclusionMap[key]) ||
						_.isFunction(val);
				}

				return obj;
			}
		});
	}
};