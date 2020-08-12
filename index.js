var ExtractorMailchimp, Sugar;

Sugar = require('sugar-and-spice');

Sugar.extend();

ExtractorMailchimp = (function() {
  class ExtractorMailchimp {
    log(logObject) {
      if (this.external_logger != null) {
        return this.external_logger(logObject);
      }
    }

    constructor(config) {
      this.axios = require('axios').default;
      this.config = config;
    }

    getPage(successCallback, errorCallback, finallyCallback) {
      var mcConfig;
      mcConfig = {
        method: "get",
        url: `${this.config.base_url}/${this.config.api_path}?count=${this.request_size}&offset=${this.running_count}`,
        auth: {
          username: "anystring",
          password: this.config.api_key
        }
      };
      return this.axios(mcConfig).then(function(response) {
        if (successCallback != null) {
          return successCallback(response);
        }
      }).catch(function(err) {
        if (err != null) {
          if (errorCallback != null) {
            return errorCallback(err);
          }
        }
      }).then(function() { // finally
        if (finallyCallback != null) {
          return finallyCallback();
        }
      });
    }

    execute(successCallback, errorCallback, finallyCallback) {
      var processPage, that;
      this.running_count = 0;
      that = this;
      if (successCallback == null) {
        if (errorCallback != null) {
          errorCallback({
            message: "Execute function was not provided a success callback"
          });
          return;
        }
      }
      processPage = function(response) {
        var data;
        data = response.data;
        that.pages.append(data);
        that.running_count = that.running_count + data[that.config.array_key].length;
        // console.log "Processed #{that.running_count} out of #{data.total_items} total items."
        if (that.running_count >= data.total_items) {
          if (successCallback != null) {
            successCallback(that.pages);
          }
          if (finallyCallback != null) {
            return finallyCallback();
          }
        } else {
          // get another page
          return that.getPage(processPage, errorCallback, null);
        }
      };
      return this.getPage(processPage, errorCallback, null);
    }

  };

  ExtractorMailchimp.prototype.external_logger = void 0;

  ExtractorMailchimp.prototype.base_url = "";

  ExtractorMailchimp.prototype.axios = null;

  ExtractorMailchimp.prototype.request_size = 1000;

  ExtractorMailchimp.prototype.total_items = 0;

  ExtractorMailchimp.prototype.pages = [];

  ExtractorMailchimp.prototype.runningCount = 0;

  return ExtractorMailchimp;

}).call(this);

module.exports = ExtractorMailchimp;
