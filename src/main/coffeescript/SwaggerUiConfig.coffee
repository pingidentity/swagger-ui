SwaggerUiConfig =
  ### 
    Show the data type column for Sandbox parameters. If false, any parameter 
    models will show up in the Operation Models section. Setting this to false
    can be useful if you have complex models that will cause the Data Type 
    column to expand to unfriendly sizes.
  ###
  showParameterDataTypeColumn: false

  ### 
    Show the parameter content type drop down for complex Sandbox parameters
    to allow users to select which content-type they want to send the parameter
    as. If false, the dropdown will be hidden and the first content-type defined
    by the API will be used. Particularly useful to set this to false if you
    only have one content-type
  ###
  showParameterContentType: false

  ### 
    Show the response content-type drop down for to allow users to select
    which content-type they want to be returned from the operation.
    If false, the dropdown will be hidden and the first content-type defined
    by the API will be used. Particularly useful to set this to false if you
    only have one response content-type
  ###
  showResponseContentType: false

  ###
    By default the Sandbox area appears at the bottom of the Operation's 
    section. Set to true if you want it to appear above the Models section.
  ###
  moveSandboxToTop: true

  ###
    Whether to mark the models' properties with an optional tag if they are not
    required.
  ###
  showOptionalPropertiesTag: false

  ###
    Whether to use the last element of a resource's path as its element name.
    Or use the resource's path as its name
  ###
  useShortResourceName: false

  ###
    Swaggers Sandbox will not work if the browser window's location host does
    not match the API's base URL, because of CSRF prevention. Set to true if
    the API docs and API rest service share the same domain. This will force
    Swagger UI to use the same hostname as window.location. Only really needed
    for a slightly better user experience. Otherwise the user should go to the
    correct domain.
  ###
  apiDocsAndRestOnSameServer: true

window.SwaggerUiConfig = SwaggerUiConfig