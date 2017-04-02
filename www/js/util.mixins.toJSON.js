window.FongPhone = window.FongPhone || {};

FongPhone.Utils = window.FongPhone.Utils || {};
FongPhone.Utils.Mixins = window.FongPhone.Utils.Mixins || {};

FongPhone.Utils.Mixins.ToJSON = {
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
							   obj[key].push(entry.toJSON ? entry.toJSON() : _stripExcluded(entry));
							});
						} else {
							obj[key] = (val && val.toJSON) ? val.toJSON() : _stripExcluded(val);
						}
					}
				});

				return obj;
			}
		});

		function _stripExcluded(obj) {
			if (!(typeof obj === 'object'))
				return obj;
			if (obj instanceof String)
				return obj;

			var objKeys = Object.keys(obj);
			var objKeysLen = objKeys.length;
			var key;
			var val;
			var rtn = {};

			for (var i = 0; i < objKeysLen; i++) {
				key = objKeys[i];
				val = obj[key];
				if (!_excluded(val, key)) {
					rtn[key] = val;
				}
			}

			return rtn;
		}

		function _excluded (val, key) {
			return (key[0] === '$') ||
				(key[0] === '_') ||
				!!(exclusionMap[key]) ||
				_.isFunction(val);
		}
	}
};
