window.FongPhone = window.FongPhone || {};
window.FongPhone.Utils = window.FongPhone.Utils || {};
window.FongPhone.Utils.Mixins = window.FongPhone.Utils.Mixins || {};

window.FongPhone.Utils.Mixins.ToJSON = {
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

                function _excluded(val, key) {
                    return (key[0] === '_') ||
                        !!(exclusionMap[key]) ||
                        _.isFunction(val);
                }

                return obj;
            }
        });
    }
};