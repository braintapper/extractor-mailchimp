Sugar = require('sugar-and-spice')
Sugar.extend()


class ExtractorMailchimp

  external_logger: undefined
  base_url: ""
  axios: null
  request_size: 1000
  total_items: 0


  log: (logObject)->

    if @external_logger?
      @external_logger logObject


  constructor: (config)->
    @axios = require('axios').default

    @config = config

  pages: []
  runningCount: 0

  getPage: (successCallback,errorCallback,finallyCallback)->

    mcConfig =
      method: "get"
      url: "#{@config.base_url}/#{@config.api_path}?count=#{@request_size}&offset=#{@running_count}"
      auth:
        username: "anystring",
        password: @config.api_key

    @axios(mcConfig)
    .then (response)->
      if successCallback?
        successCallback response
    .catch (err)->
      if err?
        if errorCallback?
          errorCallback err
    .then ()-> # finally
      if finallyCallback?
        finallyCallback()


  execute: (successCallback, errorCallback, finallyCallback)->
    @running_count = 0
    that = @


    unless successCallback?
      if errorCallback?
        errorCallback { message: "Execute function was not provided a success callback" }
        return

    processPage = (response)->

      data = response.data
      that.pages.append data
      that.running_count = that.running_count + data[that.config.array_key].length

      # console.log "Processed #{that.running_count} out of #{data.total_items} total items."

      if that.running_count >= data.total_items
        if successCallback?
          successCallback that.pages
        if finallyCallback?
          finallyCallback()
      else
        # get another page
        that.getPage processPage,errorCallback, null



    @getPage processPage,errorCallback, null



module.exports = ExtractorMailchimp
