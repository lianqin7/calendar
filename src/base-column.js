define(function(require, exports, module) {
  var $ = require('$');
  var moment = require('moment');
  var Widget = require('widget');

  var BaseColumn = Widget.extend({
    attrs: {
      focus: {
        value: '',
        getter: function(val) {
          if (val) {
            return val;
          }
          return moment();
        },
        setter: function(val) {
          if (!val) {
            return moment();
          }
          if (moment.isMoment(val)) {
            return val;
          }
          return moment(val, this.get('format'));
        }
      },
      template: null,
      format: 'YYYY-MM-DD',
      lang: {}
    },

    compileTemplate: function() {
      // the template is a runtime handlebars function
      var fn = this.get('template');
      if (!fn) {
        return '';
      }
      var model = this.get('model');

      var self = this;
      var lang = this.get('lang') || {};

      return fn(model, {
        helpers: {
          '_': function(key) {
            return lang[key] || key;
          }
        }
      });
    },

    parseElement: function() {
      // rewrite parseElement of widget
      this.element = $(this.compileTemplate());
    },

    show: function() {
      this.render();
      this.focus();
    },

    hide: function() {
      this.element.hide();
    },

    refresh: function() {
      this.element.html($(this.compileTemplate()).html());
    }

  });

  module.exports = BaseColumn;

  BaseColumn.isInRange = function(date, range) {
    if (range == null) {
      return true;
    }
    if ($.isArray(range)) {
      var start = range[0];
      var end = range[1];
      var result = true;
      if (start) {
        result = result && date >= start;
      }
      if (end) {
        result = result && date <= end;
      }
      return result;
    }
    if ($.isFunction(range)) {
      return range(date);
    }
    return true;
  };
});
