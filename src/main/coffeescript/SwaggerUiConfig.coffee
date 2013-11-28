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

window.SwaggerUiConfig = SwaggerUiConfig