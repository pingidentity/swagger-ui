$(function() {

	// Helper function for vertically aligning DOM elements
	// http://www.seodenver.com/simple-vertical-align-plugin-for-jquery/
	$.fn.vAlign = function() {
		return this.each(function(i){
		var ah = $(this).height();
		var ph = $(this).parent().height();
		var mh = (ph - ah) / 2;
		$(this).css('margin-top', mh);
		});
	};

	$.fn.stretchFormtasticInputWidthToParent = function() {
		return this.each(function(i){
		var p_width = $(this).closest("form").innerWidth();
		var p_padding = parseInt($(this).closest("form").css('padding-left') ,10) + parseInt($(this).closest("form").css('padding-right'), 10);
		var this_padding = parseInt($(this).css('padding-left'), 10) + parseInt($(this).css('padding-right'), 10);
		$(this).css('width', p_width - p_padding - this_padding);
		});
	};

	$('form.formtastic li.string input, form.formtastic textarea').stretchFormtasticInputWidthToParent();

	// Vertically center these paragraphs
	// Parent may need a min-height for this to work..
	$('ul.downplayed li div.content p').vAlign();

	// When a sandbox form is submitted..
	$("form.sandbox").submit(function(){

		var error_free = true;

		// Cycle through the forms required inputs
 		$(this).find("input.required").each(function() {

			// Remove any existing error styles from the input
			$(this).removeClass('error');

			// Tack the error style on if the input is empty..
			if ($(this).val() == '') {
				$(this).addClass('error');
				$(this).wiggle();
				error_free = false;
			}

		});

		return error_free;
	});

});

function clippyCopiedCallback(a) {
  $('#api_key_copied').fadeIn().delay(1000).fadeOut();

  // var b = $("#clippy_tooltip_" + a);
  // b.length != 0 && (b.attr("title", "copied!").trigger("tipsy.reload"), setTimeout(function() {
  //   b.attr("title", "copy to clipboard")
  // },
  // 500))
}

// Logging function that accounts for browsers that don't have window.console
function log() {
  if (window.console) console.log.apply(console,arguments);
}
// Handle browsers that do console incorrectly (IE9 and below, see http://stackoverflow.com/a/5539378/7913)
if (Function.prototype.bind && console && typeof console.log == "object") {
    [
      "log","info","warn","error","assert","dir","clear","profile","profileEnd"
    ].forEach(function (method) {
        console[method] = this.bind(console[method], console);
    }, Function.prototype.call);
}

var Docs = {

	shebang: function() {

		// If shebang has an operation nickname in it..
		// e.g. /docs/#!/words/get_search
		var fragments = $.param.fragment().split('/');
		fragments.shift(); // get rid of the bang

		switch (fragments.length) {
			case 1:
				// Expand all operations for the resource and scroll to it
//				log('shebang resource:' + fragments[0]);
				var dom_id = 'resource_' + fragments[0];

				Docs.expandEndpointListForResource(fragments[0]);
				$("#"+dom_id).slideto({highlight: false});
				break;
			case 2:
				// Refer to the endpoint DOM element, e.g. #words_get_search
//				log('shebang endpoint: ' + fragments.join('_'));

                // Expand Resource
                Docs.expandEndpointListForResource(fragments[0]);
                $("#"+dom_id).slideto({highlight: false});

                // Expand operation
				var li_dom_id = fragments.join('_');
				var li_content_dom_id = li_dom_id + "_content";

//                log("li_dom_id " + li_dom_id);
//                log("li_content_dom_id " + li_content_dom_id);

				Docs.expandOperation($('#'+li_content_dom_id));
				$('#'+li_dom_id).slideto({highlight: false});
				break;
		}

	},

	toggleEndpointListForResource: function(resource) {
		var elem = $('li#resource_' + Docs.escapeResourceName(resource) + ' ul.endpoints');
		if (elem.is(':visible')) {
			Docs.collapseEndpointListForResource(resource);
		} else {
			Docs.expandEndpointListForResource(resource);
		}
	},

	// Expand resource
	expandEndpointListForResource: function(resource) {
		var resource = Docs.escapeResourceName(resource);
		if (resource == '') {
			$('.resource ul.endpoints').slideDown();
			return;
		}
		
		$('li#resource_' + resource).addClass('active');

		var elem = $('li#resource_' + resource + ' ul.endpoints');
		elem.slideDown();
	},

	// Collapse resource and mark as explicitly closed
	collapseEndpointListForResource: function(resource) {
		var resource = Docs.escapeResourceName(resource);
		$('li#resource_' + resource).removeClass('active');

		var elem = $('li#resource_' + resource + ' ul.endpoints');
		elem.slideUp();
	},

	toggleOperationsForResource: function(resource) {
		var elem = $('li#resource_' + Docs.escapeResourceName(resource) + ' ul.endpoints');
		if (elem.is(':visible')) {
			var aOperationVisible = false;
			$('li.operation div.content').each(function() {
				if ($(this).is(':visible')) {
					aOperationVisible = true;
					return false;
				}
			});

			if (aOperationVisible) {
				Docs.collapseOperationsForResource(resource);
			} else {
				Docs.expandOperationsForResource(resource);
			}
		} else {
			Docs.collapseOperationsForResource(resource);
		}
	},

	expandOperationsForResource: function(resource) {
		// Make sure the resource container is open..
		Docs.expandEndpointListForResource(resource);
		
		if (resource == '') {
			$('.resource ul.endpoints li.operation div.content').slideDown();
			return;
		}

		$('li#resource_' + Docs.escapeResourceName(resource) + ' li.operation div.content').each(function() {
			Docs.expandOperation($(this));
		});
	},

	collapseOperationsForResource: function(resource) {
		// Make sure the resource container is open..
		Docs.expandEndpointListForResource(resource);

		$('li#resource_' + Docs.escapeResourceName(resource) + ' li.operation div.content').each(function() {
			Docs.collapseOperation($(this));
		});
	},

	escapeResourceName: function(resource) {
		return resource.replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g, "\\$&");
	},

	expandOperation: function(elem) {
		elem.slideDown();
	},

	collapseOperation: function(elem) {
		elem.slideUp();
	}

};
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['content_type'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n  ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.produces), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n";
},"2":function(depth0,helpers,partials,data) {
  var stack1, functionType="function", buffer = "\n	<option value=\"";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "</option>\n	";
},"4":function(depth0,helpers,partials,data) {
  return "\n  <option value=\"application/json\">application/json</option>\n";
  },"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<label for=\"contentType\"></label>\n<select name=\"contentType\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.produces), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(4, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n</select>\n";
},"useData":true});
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['main'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, functionType="function", escapeExpression=this.escapeExpression, buffer = "\n    <div class=\"info_title\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n    <div class=\"info_description\">";
  stack1 = ((stack1 = ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.description)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n    ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.termsOfServiceUrl), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.contact), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.license), {"name":"if","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n  ";
},"2":function(depth0,helpers,partials,data) {
  var stack1, functionType="function", escapeExpression=this.escapeExpression;
  return "<div class=\"info_tos\"><a href=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.termsOfServiceUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">Terms of service</a></div>";
},"4":function(depth0,helpers,partials,data) {
  var stack1, functionType="function", escapeExpression=this.escapeExpression;
  return "<div class='info_contact'><a href=\"mailto:"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.contact)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">Contact the developer</a></div>";
},"6":function(depth0,helpers,partials,data) {
  var stack1, functionType="function", escapeExpression=this.escapeExpression;
  return "<div class='info_license'><a href='"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.licenseUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.info)),stack1 == null || stack1 === false ? stack1 : stack1.license)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></div>";
},"8":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n        , <span style=\"font-variant: small-caps\">api version</span>: "
    + escapeExpression(((helper = helpers.apiVersion || (depth0 && depth0.apiVersion)),(typeof helper === functionType ? helper.call(depth0, {"name":"apiVersion","hash":{},"data":data}) : helper)))
    + "\n        ";
},"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class='info' id='api_info'>\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.info), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n<div class='container' id='resources_container'>\n    <ul id='resources'>\n    </ul>\n\n    <div class=\"footer\">\n        <br>\n        <br>\n        <h4 style=\"color: #999\">[ <span style=\"font-variant: small-caps\">api service base url</span>: "
    + escapeExpression(((helper = helpers.serviceBasePath || (depth0 && depth0.serviceBasePath)),(typeof helper === functionType ? helper.call(depth0, {"name":"serviceBasePath","hash":{},"data":data}) : helper)))
    + "\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.apiVersion), {"name":"if","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "]</h4>\n        <br/>\n    </div>\n</div>\n";
},"useData":true});
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['operation'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", buffer = "\n        <p>";
  stack1 = ((helper = helpers.notes || (depth0 && depth0.notes)),(typeof helper === functionType ? helper.call(depth0, {"name":"notes","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "</p>\n        ";
},"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", buffer = "\n        <p>";
  stack1 = ((helper = helpers.summary || (depth0 && depth0.summary)),(typeof helper === functionType ? helper.call(depth0, {"name":"summary","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "</p>\n        ";
},"5":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, buffer = "\n        <h4>Response Class</h4>\n        <p><span id=\"response-class\" class=\"model-signature\" /></p>\n        ";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showResponseContentType", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = (helper = helpers.unlessSwaggerUiConfig || (depth0 && depth0.unlessSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"unlessSwaggerUiConfig","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n        ";
},"6":function(depth0,helpers,partials,data) {
  return "\n        <div class=\"response-content-type\" />\n        ";
  },"8":function(depth0,helpers,partials,data) {
  return "\n        <h4>Operation Models</h4>\n        <p><div class=\"model-signature\"><div class=\"signature-container\"><div id=\"operation-models\" class=\"description\"/></div></div></p>\n        ";
  },"10":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, buffer = "\n          <h4>Parameters</h4>\n          <table class='fullwidth'>\n          <thead>\n            <tr>\n            ";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(11, data),"inverse":this.program(13, data),"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n            </tr>\n          </thead>\n          <tbody class=\"operation-params\">\n\n          </tbody>\n          </table>\n          ";
},"11":function(depth0,helpers,partials,data) {
  return "\n            <th style=\"width: 100px; max-width: 100px\">Parameter</th>\n            <th style=\"width: 310px; max-width: 310px\">Value</th>\n            <th style=\"width: 200px; max-width: 200px\">Description</th>\n            <th style=\"width: 100px; max-width: 100px\">Parameter Type</th>\n            <th style=\"width: 220px; max-width: 230px\">Data Type</th>\n            ";
  },"13":function(depth0,helpers,partials,data) {
  return "\n            <th style=\"width: 100px; max-width: 100px\">Parameter</th>\n            <th style=\"width: 530px; max-width: 530px\">Value</th>\n            <th style=\"width: 200px; max-width: 200px\">Description</th>\n            <th style=\"width: 100px; max-width: 100px\">Parameter Type</th>\n            ";
  },"15":function(depth0,helpers,partials,data) {
  return "\n          <div style='margin:0;padding:0;display:inline'></div>\n          <h4>Error Status Codes</h4>\n          <table class='fullwidth'>\n            <thead>\n            <tr>\n              <th>HTTP Status Code</th>\n              <th>Reason</th>\n            </tr>\n            </thead>\n            <tbody class=\"operation-status\">\n            \n            </tbody>\n          </table>\n          ";
  },"17":function(depth0,helpers,partials,data) {
  return "\n          ";
  },"19":function(depth0,helpers,partials,data) {
  return "\n          <div class='sandbox_header'>\n            <input class='submit' name='commit' type='button' value='Try it out!' />\n            <a href='#' class='response_hider' style='display:none'>Hide Response</a>\n            <img alt='Throbber' class='response_throbber' src='images/throbber.gif' style='display:none' />\n          </div>\n          ";
  },"21":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, buffer = "\n        <br/>\n        <h4>Response Class</h4>\n        <p><span id=\"response-class\" class=\"model-signature\" /></p>\n        ";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showResponseContentType", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = (helper = helpers.unlessSwaggerUiConfig || (depth0 && depth0.unlessSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"unlessSwaggerUiConfig","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n        ";
},"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "\n  <ul class='operations' >\n    <li class='"
    + escapeExpression(((helper = helpers.method || (depth0 && depth0.method)),(typeof helper === functionType ? helper.call(depth0, {"name":"method","hash":{},"data":data}) : helper)))
    + " operation' id='"
    + escapeExpression(((helper = helpers.resourceName || (depth0 && depth0.resourceName)),(typeof helper === functionType ? helper.call(depth0, {"name":"resourceName","hash":{},"data":data}) : helper)))
    + "_"
    + escapeExpression(((helper = helpers.nickname || (depth0 && depth0.nickname)),(typeof helper === functionType ? helper.call(depth0, {"name":"nickname","hash":{},"data":data}) : helper)))
    + "_"
    + escapeExpression(((helper = helpers.method || (depth0 && depth0.method)),(typeof helper === functionType ? helper.call(depth0, {"name":"method","hash":{},"data":data}) : helper)))
    + "_"
    + escapeExpression(((helper = helpers.number || (depth0 && depth0.number)),(typeof helper === functionType ? helper.call(depth0, {"name":"number","hash":{},"data":data}) : helper)))
    + "'>\n      <div class='heading'>\n        <h3>\n          <span class='http_method'>\n          <a href='#!/"
    + escapeExpression(((helper = helpers.resourceName || (depth0 && depth0.resourceName)),(typeof helper === functionType ? helper.call(depth0, {"name":"resourceName","hash":{},"data":data}) : helper)))
    + "/"
    + escapeExpression(((helper = helpers.nickname || (depth0 && depth0.nickname)),(typeof helper === functionType ? helper.call(depth0, {"name":"nickname","hash":{},"data":data}) : helper)))
    + "_"
    + escapeExpression(((helper = helpers.method || (depth0 && depth0.method)),(typeof helper === functionType ? helper.call(depth0, {"name":"method","hash":{},"data":data}) : helper)))
    + "_"
    + escapeExpression(((helper = helpers.number || (depth0 && depth0.number)),(typeof helper === functionType ? helper.call(depth0, {"name":"number","hash":{},"data":data}) : helper)))
    + "' class=\"toggleOperation\">"
    + escapeExpression(((helper = helpers.method || (depth0 && depth0.method)),(typeof helper === functionType ? helper.call(depth0, {"name":"method","hash":{},"data":data}) : helper)))
    + "</a>\n          </span>\n          <span class='path'>\n          <a href='#!/"
    + escapeExpression(((helper = helpers.resourceName || (depth0 && depth0.resourceName)),(typeof helper === functionType ? helper.call(depth0, {"name":"resourceName","hash":{},"data":data}) : helper)))
    + "/"
    + escapeExpression(((helper = helpers.nickname || (depth0 && depth0.nickname)),(typeof helper === functionType ? helper.call(depth0, {"name":"nickname","hash":{},"data":data}) : helper)))
    + "_"
    + escapeExpression(((helper = helpers.method || (depth0 && depth0.method)),(typeof helper === functionType ? helper.call(depth0, {"name":"method","hash":{},"data":data}) : helper)))
    + "_"
    + escapeExpression(((helper = helpers.number || (depth0 && depth0.number)),(typeof helper === functionType ? helper.call(depth0, {"name":"number","hash":{},"data":data}) : helper)))
    + "' class=\"toggleOperation\">"
    + escapeExpression(((helper = helpers.path || (depth0 && depth0.path)),(typeof helper === functionType ? helper.call(depth0, {"name":"path","hash":{},"data":data}) : helper)))
    + "</a>\n          </span>\n        </h3>\n        <ul class='options'>\n          <li>\n          <a href='#!/"
    + escapeExpression(((helper = helpers.resourceName || (depth0 && depth0.resourceName)),(typeof helper === functionType ? helper.call(depth0, {"name":"resourceName","hash":{},"data":data}) : helper)))
    + "/"
    + escapeExpression(((helper = helpers.nickname || (depth0 && depth0.nickname)),(typeof helper === functionType ? helper.call(depth0, {"name":"nickname","hash":{},"data":data}) : helper)))
    + "_"
    + escapeExpression(((helper = helpers.method || (depth0 && depth0.method)),(typeof helper === functionType ? helper.call(depth0, {"name":"method","hash":{},"data":data}) : helper)))
    + "_"
    + escapeExpression(((helper = helpers.number || (depth0 && depth0.number)),(typeof helper === functionType ? helper.call(depth0, {"name":"number","hash":{},"data":data}) : helper)))
    + "' class=\"toggleOperation\">";
  stack1 = ((helper = helpers.summary || (depth0 && depth0.summary)),(typeof helper === functionType ? helper.call(depth0, {"name":"summary","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>\n          </li>\n        </ul>\n      </div>\n      <div class='content' id='"
    + escapeExpression(((helper = helpers.resourceName || (depth0 && depth0.resourceName)),(typeof helper === functionType ? helper.call(depth0, {"name":"resourceName","hash":{},"data":data}) : helper)))
    + "_"
    + escapeExpression(((helper = helpers.nickname || (depth0 && depth0.nickname)),(typeof helper === functionType ? helper.call(depth0, {"name":"nickname","hash":{},"data":data}) : helper)))
    + "_"
    + escapeExpression(((helper = helpers.method || (depth0 && depth0.method)),(typeof helper === functionType ? helper.call(depth0, {"name":"method","hash":{},"data":data}) : helper)))
    + "_"
    + escapeExpression(((helper = helpers.number || (depth0 && depth0.number)),(typeof helper === functionType ? helper.call(depth0, {"name":"number","hash":{},"data":data}) : helper)))
    + "_content' style='display:none'>\n        <h4>Implementation Notes</h4>\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.notes), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = (helper = helpers.unlessSwaggerUiConfig || (depth0 && depth0.unlessSwaggerUiConfig) || helperMissing,helper.call(depth0, "moveSandboxToTop", {"name":"unlessSwaggerUiConfig","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        <form accept-charset='UTF-8' class='sandbox'>\n          <div style='margin:0;padding:0;display:inline'></div>\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.parameters), {"name":"if","hash":{},"fn":this.program(10, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.responseMessages), {"name":"if","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isReadOnly), {"name":"if","hash":{},"fn":this.program(17, data),"inverse":this.program(19, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </form>\n        <div class='response' style='display:none'>\n          <h4>Request URL</h4>\n          <div class='block request_url'></div>\n          <h4>Response Body</h4>\n          <div class='block response_body'></div>\n          <h4>Response Code</h4>\n          <div class='block response_code'></div>\n          <h4>Response Headers</h4>\n          <div class='block response_headers'></div>\n        </div>\n        ";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "moveSandboxToTop", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(21, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n      </div>\n    </li>\n  </ul>\n";
},"useData":true});
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['param'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isFile), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n	";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n			<input type=\"file\" name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'/>\n			<div class=\"parameter-content-type\" />\n		";
},"4":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, buffer = "\n			";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(5, data),"inverse":this.program(7, data),"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			<br />\n			";
  stack1 = (helper = helpers.unlessSwaggerUiConfig || (depth0 && depth0.unlessSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"unlessSwaggerUiConfig","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterContentType", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n		";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n			<textarea class='body-textarea' name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = helpers.defaultValue || (depth0 && depth0.defaultValue)),(typeof helper === functionType ? helper.call(depth0, {"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "</textarea>\n			";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n			<textarea class='body-textarea' placeholder='"
    + escapeExpression(((helper = helpers.type || (depth0 && depth0.type)),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + "' name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = helpers.defaultValue || (depth0 && depth0.defaultValue)),(typeof helper === functionType ? helper.call(depth0, {"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "</textarea>\n			";
},"9":function(depth0,helpers,partials,data) {
  return "\n			<a class=\"paste-model-template\" href=\"#\"><img src=\"images/paste_plain.png\" style=\"margin-right: 4px\"/>Paste model template</a>\n			<br>\n			";
  },"11":function(depth0,helpers,partials,data) {
  return "\n			<div class=\"parameter-content-type\" />\n			";
  },"13":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, buffer = "\n		";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(14, data),"inverse":this.program(16, data),"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n	";
},"14":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n		<input class='parameter' minlength='0' name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "' placeholder='' type='text' value='"
    + escapeExpression(((helper = helpers.defaultValue || (depth0 && depth0.defaultValue)),(typeof helper === functionType ? helper.call(depth0, {"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "'/>\n		";
},"16":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n		<input class='parameter' minlength='0' name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "' placeholder='"
    + escapeExpression(((helper = helpers.type || (depth0 && depth0.type)),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + "' type='text' value='"
    + escapeExpression(((helper = helpers.defaultValue || (depth0 && depth0.defaultValue)),(typeof helper === functionType ? helper.call(depth0, {"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "'/>\n		";
},"18":function(depth0,helpers,partials,data) {
  return "\n<td>\n	<span class=\"model-signature\"></span>\n</td>\n";
  },"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "<td class='code'>"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n<td>\n\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isBody), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(13, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n</td>\n<td>";
  stack1 = ((helper = helpers.description || (depth0 && depth0.description)),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n<td>";
  stack1 = ((helper = helpers.paramType || (depth0 && depth0.paramType)),(typeof helper === functionType ? helper.call(depth0, {"name":"paramType","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(18, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
},"useData":true});
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['param_list'] = template({"1":function(depth0,helpers,partials,data) {
  return " multiple='multiple'";
  },"3":function(depth0,helpers,partials,data) {
  return "\n    ";
  },"5":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n      ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.defaultValue), {"name":"if","hash":{},"fn":this.program(6, data),"inverse":this.program(8, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n    ";
},"6":function(depth0,helpers,partials,data) {
  return "\n      ";
  },"8":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.allowMultiple), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.program(11, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n      ";
},"9":function(depth0,helpers,partials,data) {
  return "\n         ";
  },"11":function(depth0,helpers,partials,data) {
  return "\n          <option selected=\"\" value=''></option>\n         ";
  },"13":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n      ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isDefault), {"name":"if","hash":{},"fn":this.program(14, data),"inverse":this.program(16, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n    ";
},"14":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n        <option selected=\"\" value='"
    + escapeExpression(((helper = helpers.value || (depth0 && depth0.value)),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = helpers.value || (depth0 && depth0.value)),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + " (default)</option>\n      ";
},"16":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n        <option value='"
    + escapeExpression(((helper = helpers.value || (depth0 && depth0.value)),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = helpers.value || (depth0 && depth0.value)),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "</option>\n      ";
},"18":function(depth0,helpers,partials,data) {
  return "\n<td><span class=\"model-signature\"></span></td>\n";
  },"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "<td class='code'>"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n<td>\n  <select ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.allowMultiple), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " class='parameter' name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'>\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.required), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(5, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.allowableValues)),stack1 == null || stack1 === false ? stack1 : stack1.descriptiveValues), {"name":"each","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </select>\n</td>\n<td>";
  stack1 = ((helper = helpers.description || (depth0 && depth0.description)),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n<td>";
  stack1 = ((helper = helpers.paramType || (depth0 && depth0.paramType)),(typeof helper === functionType ? helper.call(depth0, {"name":"paramType","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(18, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
},"useData":true});
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['param_readonly'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, buffer = "\n        ";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n    ";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n        <textarea class='body-textarea' readonly='readonly' name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = helpers.defaultValue || (depth0 && depth0.defaultValue)),(typeof helper === functionType ? helper.call(depth0, {"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "</textarea>\n        ";
},"4":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n        <textarea class='body-textarea' readonly='readonly' placeholder='"
    + escapeExpression(((helper = helpers.type || (depth0 && depth0.type)),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + "' name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = helpers.defaultValue || (depth0 && depth0.defaultValue)),(typeof helper === functionType ? helper.call(depth0, {"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "</textarea>\n        ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.defaultValue), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n    ";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n            "
    + escapeExpression(((helper = helpers.defaultValue || (depth0 && depth0.defaultValue)),(typeof helper === functionType ? helper.call(depth0, {"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "\n        ";
},"9":function(depth0,helpers,partials,data) {
  return "\n            (empty)\n        ";
  },"11":function(depth0,helpers,partials,data) {
  return "\n<td><span class=\"model-signature\"></span></td>\n";
  },"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "<td class='code'>"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n<td>\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isBody), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(6, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</td>\n<td>";
  stack1 = ((helper = helpers.description || (depth0 && depth0.description)),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n<td>";
  stack1 = ((helper = helpers.paramType || (depth0 && depth0.paramType)),(typeof helper === functionType ? helper.call(depth0, {"name":"paramType","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
},"useData":true});
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['param_readonly_required'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, buffer = "\n        ";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n    ";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n        <textarea class='body-textarea'  readonly='readonly' placeholder='(required)' name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = helpers.defaultValue || (depth0 && depth0.defaultValue)),(typeof helper === functionType ? helper.call(depth0, {"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "</textarea>\n        ";
},"4":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n        <textarea class='body-textarea'  readonly='readonly' placeholder='"
    + escapeExpression(((helper = helpers.type || (depth0 && depth0.type)),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + " (required)' name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = helpers.defaultValue || (depth0 && depth0.defaultValue)),(typeof helper === functionType ? helper.call(depth0, {"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "</textarea>\n        ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.defaultValue), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n    ";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n            "
    + escapeExpression(((helper = helpers.defaultValue || (depth0 && depth0.defaultValue)),(typeof helper === functionType ? helper.call(depth0, {"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "\n        ";
},"9":function(depth0,helpers,partials,data) {
  return "\n            (empty)\n        ";
  },"11":function(depth0,helpers,partials,data) {
  return "\n<td><span class=\"model-signature\"></span></td>\n";
  },"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "<td class='code required'>"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n<td>\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isBody), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(6, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</td>\n<td>";
  stack1 = ((helper = helpers.description || (depth0 && depth0.description)),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n<td>";
  stack1 = ((helper = helpers.paramType || (depth0 && depth0.paramType)),(typeof helper === functionType ? helper.call(depth0, {"name":"paramType","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
},"useData":true});
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['param_required'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isFile), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n	";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n			<input type=\"file\" name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'/>\n		";
},"4":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, buffer = "\n			";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(5, data),"inverse":this.program(7, data),"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "	\n			<br />\n			";
  stack1 = (helper = helpers.unlessSwaggerUiConfig || (depth0 && depth0.unlessSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"unlessSwaggerUiConfig","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterContentType", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n		";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n			<textarea class='body-textarea' placeholder='(required)' name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = helpers.defaultValue || (depth0 && depth0.defaultValue)),(typeof helper === functionType ? helper.call(depth0, {"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "</textarea>\n			";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n			<textarea class='body-textarea' placeholder='"
    + escapeExpression(((helper = helpers.type || (depth0 && depth0.type)),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + " (required)' name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = helpers.defaultValue || (depth0 && depth0.defaultValue)),(typeof helper === functionType ? helper.call(depth0, {"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "</textarea>\n			";
},"9":function(depth0,helpers,partials,data) {
  return "\n			<a class=\"paste-model-template\" href=\"#\"><img src=\"images/paste_plain.png\" style=\"margin-right: 4px\"/>Paste model template</a>\n			<br>\n			";
  },"11":function(depth0,helpers,partials,data) {
  return "\n			<div class=\"parameter-content-type\" />\n			";
  },"13":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isFile), {"name":"if","hash":{},"fn":this.program(14, data),"inverse":this.program(16, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n	";
},"14":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n			<input class='parameter' class='required' type='file' name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'/>\n		";
},"16":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, buffer = "\n			";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(17, data),"inverse":this.program(19, data),"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "	\n		";
},"17":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n			<input class='parameter required' minlength='1' name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "' placeholder='(required)' type='text' value='"
    + escapeExpression(((helper = helpers.defaultValue || (depth0 && depth0.defaultValue)),(typeof helper === functionType ? helper.call(depth0, {"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "'/>\n			";
},"19":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n			<input class='parameter required' minlength='1' name='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "' placeholder='"
    + escapeExpression(((helper = helpers.type || (depth0 && depth0.type)),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + " (required)' type='text' value='"
    + escapeExpression(((helper = helpers.defaultValue || (depth0 && depth0.defaultValue)),(typeof helper === functionType ? helper.call(depth0, {"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "'/>\n			";
},"21":function(depth0,helpers,partials,data) {
  return "\n<td><span class=\"model-signature\"></span></td>\n";
  },"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "<td class='code required'>"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n<td>\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isBody), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(13, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</td>\n<td>\n	<strong>";
  stack1 = ((helper = helpers.description || (depth0 && depth0.description)),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</strong>\n</td>\n<td>";
  stack1 = ((helper = helpers.paramType || (depth0 && depth0.paramType)),(typeof helper === functionType ? helper.call(depth0, {"name":"paramType","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "showParameterDataTypeColumn", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(21, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
},"useData":true});
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['parameter_content_type'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n  ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.consumes), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n";
},"2":function(depth0,helpers,partials,data) {
  var stack1, functionType="function", buffer = "\n  <option value=\"";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "</option>\n  ";
},"4":function(depth0,helpers,partials,data) {
  return "\n  <option value=\"application/json\">application/json</option>\n";
  },"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<label for=\"parameterContentType\"></label>\n<select name=\"parameterContentType\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.consumes), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(4, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n</select>\n";
},"useData":true});
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['resource'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)));
  },"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = helpers.path || (depth0 && depth0.path)),(typeof helper === functionType ? helper.call(depth0, {"name":"path","hash":{},"data":data}) : helper)));
  },"5":function(depth0,helpers,partials,data) {
  return " : ";
  },"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, blockHelperMissing=helpers.blockHelperMissing, buffer = "<div class='heading'>\n  <h2>\n    <a href='#!/"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "' onclick=\"Docs.toggleEndpointListForResource('"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "');\">";
  stack1 = (helper = helpers.ifSwaggerUiConfig || (depth0 && depth0.ifSwaggerUiConfig) || helperMissing,helper.call(depth0, "useShortResourceName", {"name":"ifSwaggerUiConfig","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helper = helpers.description || (depth0 && depth0.description)),(options={"name":"description","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.description) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = ((helper = helpers.description || (depth0 && depth0.description)),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "</a>\n  </h2>\n  <ul class='options'>\n    <li>\n      <a href='#' onclick=\"Docs.toggleOperationsForResource('"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "'); return false;\">\n        List/Expand Operations\n      </a>\n    </li>\n    <li>\n      <a href='"
    + escapeExpression(((helper = helpers.url || (depth0 && depth0.url)),(typeof helper === functionType ? helper.call(depth0, {"name":"url","hash":{},"data":data}) : helper)))
    + "' target=\"_blank\">Resource Metadata</a>\n    </li>\n  </ul>\n</div>\n<ul class='endpoints' id='"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "_endpoint_list' style='display:none'>\n\n</ul>\n";
},"useData":true});
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['response_content_type'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\n  ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.produces), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n";
},"2":function(depth0,helpers,partials,data) {
  var stack1, functionType="function", buffer = "\n  <option value=\"";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "</option>\n  ";
},"4":function(depth0,helpers,partials,data) {
  return "\n  <option value=\"application/json\">application/json</option>\n";
  },"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<label for=\"responseContentType\"></label>\n<select name=\"responseContentType\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.produces), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(4, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n</select>\n";
},"useData":true});
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['signature'] = template({"1":function(depth0,helpers,partials,data) {
  return "\n    <div class=\"snippet code-clickable\">\n    ";
  },"3":function(depth0,helpers,partials,data) {
  return "\n    <div class=\"snippet\">\n    ";
  },"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div>\n<ul class=\"signature-nav\">\n    <li><a class=\"description-link\" href=\"#\">Model</a></li>\n    <li><a class=\"snippet-link\" href=\"#\">Model Schema</a></li>\n</ul>\n<div>\n\n<div class=\"signature-container\">\n    <div class=\"description\">\n        ";
  stack1 = ((helper = helpers.signature || (depth0 && depth0.signature)),(typeof helper === functionType ? helper.call(depth0, {"name":"signature","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isParam), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n        <pre><code>"
    + escapeExpression(((helper = helpers.sampleJSON || (depth0 && depth0.sampleJSON)),(typeof helper === functionType ? helper.call(depth0, {"name":"sampleJSON","hash":{},"data":data}) : helper)))
    + "</code></pre>\n        <small class=\"notice\"></small>\n    </div>\n</div>\n\n";
},"useData":true});
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['status_code'] = template({"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, buffer = "<td width='15%' class='code'>"
    + escapeExpression(((helper = helpers.code || (depth0 && depth0.code)),(typeof helper === functionType ? helper.call(depth0, {"name":"code","hash":{},"data":data}) : helper)))
    + "</td>\n<td>";
  stack1 = ((helper = helpers.message || (depth0 && depth0.message)),(typeof helper === functionType ? helper.call(depth0, {"name":"message","hash":{},"data":data}) : helper));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "</td>\n";
},"useData":true});
})();



// Generated by CoffeeScript 1.7.1
(function() {
  var ContentTypeView, HeaderView, MainView, OperationView, ParameterContentTypeView, ParameterView, ResourceView, ResponseContentTypeView, SignatureView, StatusCodeView, SwaggerUi, SwaggerUiConfig,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SwaggerUi = (function(_super) {
    __extends(SwaggerUi, _super);

    function SwaggerUi() {
      return SwaggerUi.__super__.constructor.apply(this, arguments);
    }

    SwaggerUi.prototype.dom_id = "swagger_ui";

    SwaggerUi.prototype.options = null;

    SwaggerUi.prototype.api = null;

    SwaggerUi.prototype.headerView = null;

    SwaggerUi.prototype.mainView = null;

    SwaggerUi.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      Handlebars.registerHelper('ifSwaggerUiConfig', function(condName, block) {
        if (SwaggerUiConfig[condName]) {
          return block.fn(this);
        } else {
          return block.inverse(this);
        }
      });
      Handlebars.registerHelper('unlessSwaggerUiConfig', function(condName, block) {
        return Handlebars.helpers['ifSwaggerUiConfig'].call(this, condName, {
          fn: block.inverse,
          inverse: block.fn
        });
      });
      if (options.dom_id != null) {
        this.dom_id = options.dom_id;
        delete options.dom_id;
      }
      if ($('#' + this.dom_id) == null) {
        $('body').append('<div id="' + this.dom_id + '"></div>');
      }
      this.options = options;
      this.options.success = (function(_this) {
        return function() {
          return _this.render();
        };
      })(this);
      this.options.progress = (function(_this) {
        return function(d) {
          return _this.showMessage(d);
        };
      })(this);
      this.options.failure = (function(_this) {
        return function(d) {
          return _this.onLoadFailure(d);
        };
      })(this);
      this.headerView = new HeaderView({
        el: $('#header')
      });
      return this.headerView.on('update-swagger-ui', (function(_this) {
        return function(data) {
          return _this.updateSwaggerUi(data);
        };
      })(this));
    };

    SwaggerUi.prototype.updateSwaggerUi = function(data) {
      this.options.url = data.url;
      return this.load();
    };

    SwaggerUi.prototype.load = function() {
      var url, _ref;
      if ((_ref = this.mainView) != null) {
        _ref.clear();
      }
      url = this.options.url;
      if (url.indexOf("http") !== 0) {
        url = this.buildUrl(window.location.href.toString(), url);
      }
      this.options.url = url;
      this.headerView.update(url);
      this.api = new SwaggerApi(this.options);
      this.api.build();
      return this.api;
    };

    SwaggerUi.prototype.render = function() {
      this.showMessage('Finished Loading Resource Information. Rendering Swagger UI...');
      this.mainView = new MainView({
        model: this.api,
        el: $('#' + this.dom_id)
      }).render();
      this.showMessage();
      switch (this.options.docExpansion) {
        case "full":
          Docs.expandOperationsForResource('');
          break;
        case "list":
          Docs.collapseOperationsForResource('');
      }
      if (this.options.onComplete) {
        this.options.onComplete(this.api, this);
      }
      return setTimeout((function(_this) {
        return function() {
          return Docs.shebang();
        };
      })(this), 400);
    };

    SwaggerUi.prototype.buildUrl = function(base, url) {
      var parts;
      console.log("base is " + base);
      parts = base.split("/");
      base = parts[0] + "//" + parts[2];
      if (url.indexOf("/") === 0) {
        return base + url;
      } else {
        return base + "/" + url;
      }
    };

    SwaggerUi.prototype.showMessage = function(data) {
      if (data == null) {
        data = '';
      }
      $('#message-bar').removeClass('message-fail');
      $('#message-bar').addClass('message-success');
      return $('#message-bar').html(data);
    };

    SwaggerUi.prototype.onLoadFailure = function(data) {
      var val;
      if (data == null) {
        data = '';
      }
      $('#message-bar').removeClass('message-success');
      $('#message-bar').addClass('message-fail');
      val = $('#message-bar').html(data);
      if (this.options.onFailure != null) {
        this.options.onFailure(data);
      }
      return val;
    };

    return SwaggerUi;

  })(Backbone.Router);

  window.SwaggerUi = SwaggerUi;

  SwaggerUiConfig = {

    /* 
      Show the data type column for Sandbox parameters. If false, any parameter 
      models will show up in the Operation Models section. Setting this to false
      can be useful if you have complex models that will cause the Data Type 
      column to expand to unfriendly sizes.
     */
    showParameterDataTypeColumn: false,

    /* 
      Show the parameter content type drop down for complex Sandbox parameters
      to allow users to select which content-type they want to send the parameter
      as. If false, the dropdown will be hidden and the first content-type defined
      by the API will be used. Particularly useful to set this to false if you
      only have one content-type
     */
    showParameterContentType: false,

    /* 
      Show the response content-type drop down for to allow users to select
      which content-type they want to be returned from the operation.
      If false, the dropdown will be hidden and the first content-type defined
      by the API will be used. Particularly useful to set this to false if you
      only have one response content-type
     */
    showResponseContentType: false,

    /*
      By default the Sandbox area appears at the bottom of the Operation's 
      section. Set to true if you want it to appear above the Models section.
     */
    moveSandboxToTop: true,

    /*
      Whether to mark the models' properties with an optional tag if they are not
      required.
     */
    showOptionalPropertiesTag: false,

    /*
      Whether to use the last element of a resource's path as its element name.
      Or use the resource's path as its name
     */
    useShortResourceName: false,

    /*
      Swaggers Sandbox will not work if the browser window's location host does
      not match the API's base URL, because of CSRF prevention. Set to true if
      the API docs and API rest service share the same domain. This will force
      Swagger UI to use the same hostname as window.location. Only really needed
      for a slightly better user experience. Otherwise the user should go to the
      correct domain.
     */
    apiDocsAndRestOnSameServer: true
  };

  window.SwaggerUiConfig = SwaggerUiConfig;

  HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.prototype.events = {
      'click #show-pet-store-icon': 'showPetStore',
      'click #show-wordnik-dev-icon': 'showWordnikDev',
      'click #explore': 'showCustom',
      'keyup #input_baseUrl': 'showCustomOnKeyup',
      'keyup #input_apiKey': 'showCustomOnKeyup'
    };

    HeaderView.prototype.initialize = function() {};

    HeaderView.prototype.showPetStore = function(e) {
      return this.trigger('update-swagger-ui', {
        url: "http://petstore.swagger.wordnik.com/api/api-docs"
      });
    };

    HeaderView.prototype.showWordnikDev = function(e) {
      return this.trigger('update-swagger-ui', {
        url: "http://api.wordnik.com/v4/resources.json"
      });
    };

    HeaderView.prototype.showCustomOnKeyup = function(e) {
      if (e.keyCode === 13) {
        return this.showCustom();
      }
    };

    HeaderView.prototype.showCustom = function(e) {
      if (e != null) {
        e.preventDefault();
      }
      return this.trigger('update-swagger-ui', {
        url: $('#input_baseUrl').val(),
        apiKey: $('#input_apiKey').val()
      });
    };

    HeaderView.prototype.update = function(url, apiKey, trigger) {
      if (trigger == null) {
        trigger = false;
      }
      $('#input_baseUrl').val(url);
      if (trigger) {
        return this.trigger('update-swagger-ui', {
          url: url
        });
      }
    };

    return HeaderView;

  })(Backbone.View);

  MainView = (function(_super) {
    __extends(MainView, _super);

    function MainView() {
      return MainView.__super__.constructor.apply(this, arguments);
    }

    MainView.prototype.initialize = function() {};

    MainView.prototype.render = function() {
      var resource, _i, _len, _ref;
      $(this.el).html(Handlebars.templates.main(this.model));
      _ref = this.model.apisArray;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        resource = _ref[_i];
        this.addResource(resource);
      }
      return this;
    };

    MainView.prototype.addResource = function(resource) {
      var resourceView;
      resourceView = new ResourceView({
        model: resource,
        tagName: 'li',
        id: 'resource_' + resource.name,
        className: 'resource'
      });
      return $('#resources').append(resourceView.render().el);
    };

    MainView.prototype.clear = function() {
      return $(this.el).html('');
    };

    return MainView;

  })(Backbone.View);

  ResourceView = (function(_super) {
    __extends(ResourceView, _super);

    function ResourceView() {
      return ResourceView.__super__.constructor.apply(this, arguments);
    }

    ResourceView.prototype.initialize = function() {};

    ResourceView.prototype.render = function() {
      var operation, _i, _len, _ref;
      console.log(this.model.description);
      $(this.el).html(Handlebars.templates.resource(this.model));
      this.number = 0;
      _ref = this.model.operationsArray;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        operation = _ref[_i];
        this.addOperation(operation);
      }
      return this;
    };

    ResourceView.prototype.addOperation = function(operation) {
      var operationView;
      operation.number = this.number;
      operationView = new OperationView({
        model: operation,
        tagName: 'li',
        className: 'endpoint'
      });
      $('.endpoints', $(this.el)).append(operationView.render().el);
      return this.number++;
    };

    return ResourceView;

  })(Backbone.View);

  OperationView = (function(_super) {
    __extends(OperationView, _super);

    function OperationView() {
      return OperationView.__super__.constructor.apply(this, arguments);
    }

    OperationView.prototype.events = {
      'submit .sandbox': 'submitOperation',
      'click .submit': 'submitOperation',
      'click .response_hider': 'hideResponse',
      'click .toggleOperation': 'toggleOperationContent'
    };

    OperationView.prototype.initialize = function() {};

    OperationView.prototype.render = function() {
      var contentTypeModel, isMethodSubmissionSupported, operationModels, param, responseContentTypeView, responseSignatureView, signatureModel, statusCode, type, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      isMethodSubmissionSupported = true;
      if (!isMethodSubmissionSupported) {
        this.model.isReadOnly = true;
      }
      $(this.el).html(Handlebars.templates.operation(this.model));
      operationModels = '';
      if (this.model.responseClassSignature && !this.model.isResponseClassPrimitive) {
        signatureModel = {
          sampleJSON: this.model.responseSampleJSON,
          isParam: false,
          signature: SwaggerUiConfig.showParameterDataTypeColumn ? this.model.responseClassSignature : "<span class='strong'>" + this.model.type + "</span>"
        };
        if (!SwaggerUiConfig.showParameterDataTypeColumn) {
          operationModels = this.model.responseClassSignature;
        }
        responseSignatureView = new SignatureView({
          model: signatureModel,
          tagName: 'div'
        });
        $('#response-class', $(this.el)).append(responseSignatureView.render().el);
      } else if (this.model.type) {
        $('#response-class', $(this.el)).html(this.model.type);
      } else {
        $('#response-class', $(this.el)).html('(None)');
      }
      contentTypeModel = {
        isParam: false
      };
      contentTypeModel.consumes = this.model.consumes;
      contentTypeModel.produces = this.model.produces;
      _ref = this.model.parameters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        type = param.type || param.dataType;
        if (type.toLowerCase() === 'file') {
          if (!contentTypeModel.consumes) {
            console.log("set content type ");
            contentTypeModel.consumes = 'multipart/form-data';
          }
        }
        if (!(param.isPrimitive || SwaggerUiConfig.showParameterDataTypeColumn)) {
          if (param.signature !== null) {
            if (operationModels !== '') {
              operationModels += '<br/>';
            }
            operationModels += param.signature;
          }
        }
      }
      responseContentTypeView = new ResponseContentTypeView({
        model: contentTypeModel
      });
      $('.response-content-type', $(this.el)).append(responseContentTypeView.render().el);
      _ref1 = this.model.parameters;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        param = _ref1[_j];
        this.addParameter(param, contentTypeModel.consumes);
      }
      _ref2 = this.model.responseMessages;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        statusCode = _ref2[_k];
        this.addStatusCode(statusCode);
      }
      if (operationModels === '') {
        operationModels = '(None)';
      }
      $('#operation-models', $(this.el)).html(operationModels);
      return this;
    };

    OperationView.prototype.addParameter = function(param, consumes) {
      var paramView;
      param.consumes = consumes;
      paramView = new ParameterView({
        model: param,
        tagName: 'tr',
        readOnly: this.model.isReadOnly
      });
      return $('.operation-params', $(this.el)).append(paramView.render().el);
    };

    OperationView.prototype.addStatusCode = function(statusCode) {
      var statusCodeView;
      statusCodeView = new StatusCodeView({
        model: statusCode,
        tagName: 'tr'
      });
      return $('.operation-status', $(this.el)).append(statusCodeView.render().el);
    };

    OperationView.prototype.submitOperation = function(e) {
      var error_free, form, map, o, opts, val, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      if (e != null) {
        e.preventDefault();
      }
      form = $('.sandbox', $(this.el));
      error_free = true;
      form.find("input.required").each(function() {
        $(this).removeClass("error");
        if (jQuery.trim($(this).val()) === "") {
          $(this).addClass("error");
          $(this).wiggle({
            callback: (function(_this) {
              return function() {
                return $(_this).focus();
              };
            })(this)
          });
          return error_free = false;
        }
      });
      if (error_free) {
        map = {};
        opts = {
          parent: this
        };
        _ref = form.find("input");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          o = _ref[_i];
          if ((o.value != null) && jQuery.trim(o.value).length > 0) {
            map[o.name] = o.value;
          }
        }
        _ref1 = form.find("textarea");
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          o = _ref1[_j];
          if ((o.value != null) && jQuery.trim(o.value).length > 0) {
            map["body"] = o.value;
          }
        }
        _ref2 = form.find("select");
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          o = _ref2[_k];
          val = this.getSelectedValue(o);
          if ((val != null) && jQuery.trim(val).length > 0) {
            map[o.name] = val;
          }
        }
        opts.responseContentType = $("div select[name=responseContentType]", $(this.el)).val();
        if (!opts.responseContentType) {
          if (this.model.produces && this.model.produces.length > 0) {
            opts.responseContentType = this.model.produces[0];
          }
        }
        opts.requestContentType = $("div select[name=parameterContentType]", $(this.el)).val();
        if (!opts.requestContentType) {
          if (this.model.consumes && this.model.consumes.length > 0) {
            opts.requestContentType = this.model.consumes[0];
          }
        }
        $(".response_throbber", $(this.el)).show();
        return this.model["do"](map, opts, this.showCompleteStatus, this.showErrorStatus, this);
      }
    };

    OperationView.prototype.success = function(response, parent) {
      return parent.showCompleteStatus(response);
    };

    OperationView.prototype.getSelectedValue = function(select) {
      var opt, options, _i, _len, _ref;
      if (!select.multiple) {
        return select.value;
      } else {
        options = [];
        _ref = select.options;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          opt = _ref[_i];
          if (opt.selected) {
            options.push(opt.value);
          }
        }
        if (options.length > 0) {
          return options.join(",");
        } else {
          return null;
        }
      }
    };

    OperationView.prototype.hideResponse = function(e) {
      if (e != null) {
        e.preventDefault();
      }
      $(".response", $(this.el)).slideUp();
      return $(".response_hider", $(this.el)).fadeOut();
    };

    OperationView.prototype.showResponse = function(response) {
      var prettyJson;
      prettyJson = JSON.stringify(response, null, "\t").replace(/\n/g, "<br>");
      return $(".response_body", $(this.el)).html(escape(prettyJson));
    };

    OperationView.prototype.showErrorStatus = function(data, parent) {
      return parent.showStatus(data);
    };

    OperationView.prototype.showCompleteStatus = function(data, parent) {
      return parent.showStatus(data);
    };

    OperationView.prototype.formatXml = function(xml) {
      var contexp, formatted, indent, lastType, lines, ln, pad, reg, transitions, wsexp, _fn, _i, _len;
      reg = /(>)(<)(\/*)/g;
      wsexp = /[ ]*(.*)[ ]+\n/g;
      contexp = /(<.+>)(.+\n)/g;
      xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
      pad = 0;
      formatted = '';
      lines = xml.split('\n');
      indent = 0;
      lastType = 'other';
      transitions = {
        'single->single': 0,
        'single->closing': -1,
        'single->opening': 0,
        'single->other': 0,
        'closing->single': 0,
        'closing->closing': -1,
        'closing->opening': 0,
        'closing->other': 0,
        'opening->single': 1,
        'opening->closing': 0,
        'opening->opening': 1,
        'opening->other': 1,
        'other->single': 0,
        'other->closing': -1,
        'other->opening': 0,
        'other->other': 0
      };
      _fn = function(ln) {
        var fromTo, j, key, padding, type, types, value;
        types = {
          single: Boolean(ln.match(/<.+\/>/)),
          closing: Boolean(ln.match(/<\/.+>/)),
          opening: Boolean(ln.match(/<[^!?].*>/))
        };
        type = ((function() {
          var _results;
          _results = [];
          for (key in types) {
            value = types[key];
            if (value) {
              _results.push(key);
            }
          }
          return _results;
        })())[0];
        type = type === void 0 ? 'other' : type;
        fromTo = lastType + '->' + type;
        lastType = type;
        padding = '';
        indent += transitions[fromTo];
        padding = ((function() {
          var _j, _ref, _results;
          _results = [];
          for (j = _j = 0, _ref = indent; 0 <= _ref ? _j < _ref : _j > _ref; j = 0 <= _ref ? ++_j : --_j) {
            _results.push('  ');
          }
          return _results;
        })()).join('');
        if (fromTo === 'opening->closing') {
          return formatted = formatted.substr(0, formatted.length - 1) + ln + '\n';
        } else {
          return formatted += padding + ln + '\n';
        }
      };
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        ln = lines[_i];
        _fn(ln);
      }
      return formatted;
    };

    OperationView.prototype.showStatus = function(data) {
      var code, content, contentType, headers, pre, response_body;
      content = data.content.data;
      headers = data.getHeaders();
      contentType = headers["Content-Type"];
      if (content === void 0) {
        code = $('<code />').text("no content");
        pre = $('<pre class="json" />').append(code);
      } else if (contentType.indexOf("application/json") === 0 || contentType.indexOf("application/hal+json") === 0) {
        code = $('<code />').text(JSON.stringify(JSON.parse(content), null, 2));
        pre = $('<pre class="json" />').append(code);
      } else if (contentType.indexOf("application/xml") === 0) {
        code = $('<code />').text(this.formatXml(content));
        pre = $('<pre class="xml" />').append(code);
      } else if (contentType.indexOf("text/html") === 0) {
        code = $('<code />').html(content);
        pre = $('<pre class="xml" />').append(code);
      } else if (contentType.indexOf("application/pkcs10") === 0 || contentType.indexOf("application/x-x509-ca-cert") === 0 || contentType.indexOf("text/plain") === 0) {
        code = $('<code />').html(content);
        pre = $('<pre/>').append(code);
      } else {
        code = $('<code />').text("Content-Type '" + contentType + "' is not recognized. Content will not be displayed.");
        pre = $('<pre/>').append(code);
      }
      response_body = pre;
      $(".request_url", $(this.el)).html("<pre>" + data.request.url + "</pre>");
      $(".response_code", $(this.el)).html("<pre>" + data.status + "</pre>");
      $(".response_body", $(this.el)).html(response_body);
      $(".response_headers", $(this.el)).html("<pre>" + JSON.stringify(data.getHeaders()) + "</pre>");
      $(".response", $(this.el)).slideDown();
      $(".response_hider", $(this.el)).show();
      $(".response_throbber", $(this.el)).hide();
      return hljs.highlightBlock($('.response_body', $(this.el))[0]);
    };

    OperationView.prototype.toggleOperationContent = function() {
      var elem;
      elem = $('#' + Docs.escapeResourceName(this.model.resourceName) + "_" + this.model.nickname + "_" + this.model.method + "_" + this.model.number + "_content");
      if (elem.is(':visible')) {
        return Docs.collapseOperation(elem);
      } else {
        return Docs.expandOperation(elem);
      }
    };

    return OperationView;

  })(Backbone.View);

  StatusCodeView = (function(_super) {
    __extends(StatusCodeView, _super);

    function StatusCodeView() {
      return StatusCodeView.__super__.constructor.apply(this, arguments);
    }

    StatusCodeView.prototype.initialize = function() {};

    StatusCodeView.prototype.render = function() {
      var template;
      template = this.template();
      $(this.el).html(template(this.model));
      return this;
    };

    StatusCodeView.prototype.template = function() {
      return Handlebars.templates.status_code;
    };

    return StatusCodeView;

  })(Backbone.View);

  ParameterView = (function(_super) {
    __extends(ParameterView, _super);

    function ParameterView() {
      return ParameterView.__super__.constructor.apply(this, arguments);
    }

    ParameterView.prototype.events = {
      'click a.paste-model-template': 'snippetToTextArea'
    };

    ParameterView.prototype.initialize = function() {};

    ParameterView.prototype.render = function() {
      var contentTypeModel, isParam, parameterContentTypeView, responseContentTypeView, signatureModel, signatureView, template, type;
      type = this.model.type || this.model.dataType;
      if (this.model.paramType === 'body') {
        this.model.isBody = true;
      }
      if (type.toLowerCase() === 'file') {
        this.model.isFile = true;
      }
      template = this.template();
      $(this.el).html(template(this.model));
      signatureModel = {
        sampleJSON: this.model.sampleJSON,
        isParam: true,
        signature: this.model.signature
      };
      if (this.model.sampleJSON) {
        signatureView = new SignatureView({
          model: signatureModel,
          tagName: 'div'
        });
        $('.model-signature', $(this.el)).append(signatureView.render().el);
      } else {
        $('.model-signature', $(this.el)).html(this.model.signature);
      }
      isParam = false;
      if (this.model.isBody) {
        isParam = true;
      }
      contentTypeModel = {
        isParam: isParam
      };
      contentTypeModel.consumes = this.model.consumes;
      if (isParam) {
        parameterContentTypeView = new ParameterContentTypeView({
          model: contentTypeModel
        });
        $('.parameter-content-type', $(this.el)).append(parameterContentTypeView.render().el);
      } else {
        responseContentTypeView = new ResponseContentTypeView({
          model: contentTypeModel
        });
        $('.response-content-type', $(this.el)).append(responseContentTypeView.render().el);
      }
      return this;
    };

    ParameterView.prototype.template = function() {
      if (this.model.isList) {
        return Handlebars.templates.param_list;
      } else {
        if (this.options.readOnly) {
          if (this.model.required) {
            return Handlebars.templates.param_readonly_required;
          } else {
            return Handlebars.templates.param_readonly;
          }
        } else {
          if (this.model.required) {
            return Handlebars.templates.param_required;
          } else {
            return Handlebars.templates.param;
          }
        }
      }
    };

    ParameterView.prototype.snippetToTextArea = function(e) {
      var textArea;
      if (e != null) {
        e.preventDefault();
      }
      textArea = $('textarea', this.el);
      return textArea.val(this.model.sampleJSON);
    };

    return ParameterView;

  })(Backbone.View);

  SignatureView = (function(_super) {
    __extends(SignatureView, _super);

    function SignatureView() {
      return SignatureView.__super__.constructor.apply(this, arguments);
    }

    SignatureView.prototype.events = {
      'click a.description-link': 'switchToDescription',
      'click a.snippet-link': 'switchToSnippet',
      'mousedown .snippet': 'snippetToTextArea'
    };

    SignatureView.prototype.initialize = function() {};

    SignatureView.prototype.render = function() {
      var template;
      template = this.template();
      $(this.el).html(template(this.model));
      this.switchToDescription();
      this.isParam = this.model.isParam;
      if (this.isParam) {
        $('.notice', $(this.el)).text('Click to set as parameter value');
      }
      return this;
    };

    SignatureView.prototype.template = function() {
      return Handlebars.templates.signature;
    };

    SignatureView.prototype.switchToDescription = function(e) {
      if (e != null) {
        e.preventDefault();
      }
      $(".snippet", $(this.el)).hide();
      $(".description", $(this.el)).show();
      $('.description-link', $(this.el)).addClass('selected');
      return $('.snippet-link', $(this.el)).removeClass('selected');
    };

    SignatureView.prototype.switchToSnippet = function(e) {
      if (e != null) {
        e.preventDefault();
      }
      $(".description", $(this.el)).hide();
      $(".snippet", $(this.el)).show();
      $('.snippet-link', $(this.el)).addClass('selected');
      return $('.description-link', $(this.el)).removeClass('selected');
    };

    SignatureView.prototype.snippetToTextArea = function(e) {
      var textArea;
      if (this.isParam) {
        if (e != null) {
          e.preventDefault();
        }
        textArea = $('textarea', $(this.el.parentNode.parentNode.parentNode));
        if ($.trim(textArea.val()) === '') {
          return textArea.val(this.model.sampleJSON);
        }
      }
    };

    return SignatureView;

  })(Backbone.View);

  ContentTypeView = (function(_super) {
    __extends(ContentTypeView, _super);

    function ContentTypeView() {
      return ContentTypeView.__super__.constructor.apply(this, arguments);
    }

    ContentTypeView.prototype.initialize = function() {};

    ContentTypeView.prototype.render = function() {
      var template;
      template = this.template();
      $(this.el).html(template(this.model));
      $('label[for=contentType]', $(this.el)).text('Response Content Type');
      return this;
    };

    ContentTypeView.prototype.template = function() {
      return Handlebars.templates.content_type;
    };

    return ContentTypeView;

  })(Backbone.View);

  ResponseContentTypeView = (function(_super) {
    __extends(ResponseContentTypeView, _super);

    function ResponseContentTypeView() {
      return ResponseContentTypeView.__super__.constructor.apply(this, arguments);
    }

    ResponseContentTypeView.prototype.initialize = function() {};

    ResponseContentTypeView.prototype.render = function() {
      var template;
      template = this.template();
      $(this.el).html(template(this.model));
      $('label[for=responseContentType]', $(this.el)).text('Response Content Type');
      return this;
    };

    ResponseContentTypeView.prototype.template = function() {
      return Handlebars.templates.response_content_type;
    };

    return ResponseContentTypeView;

  })(Backbone.View);

  ParameterContentTypeView = (function(_super) {
    __extends(ParameterContentTypeView, _super);

    function ParameterContentTypeView() {
      return ParameterContentTypeView.__super__.constructor.apply(this, arguments);
    }

    ParameterContentTypeView.prototype.initialize = function() {};

    ParameterContentTypeView.prototype.render = function() {
      var template;
      template = this.template();
      $(this.el).html(template(this.model));
      $('label[for=parameterContentType]', $(this.el)).text('Parameter content type:');
      return this;
    };

    ParameterContentTypeView.prototype.template = function() {
      return Handlebars.templates.parameter_content_type;
    };

    return ParameterContentTypeView;

  })(Backbone.View);

}).call(this);
