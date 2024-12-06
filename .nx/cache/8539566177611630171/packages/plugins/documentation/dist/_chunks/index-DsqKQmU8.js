"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const index = `<!-- HTML for static distribution bundle build --><!DOCTYPE html>\r
<html lang="en">\r
  <head>\r
    <meta charset="UTF-8" />\r
    <title>Swagger UI</title>\r
    <link\r
      rel="stylesheet"\r
      type="text/css"\r
      href="<%=backendUrl%>/plugins/documentation/swagger-ui.css"\r
    />\r
    <link\r
      rel="icon"\r
      type="image/png"\r
      href="<%=backendUrl%>/plugins/documentation/favicon-32x32.png"\r
      sizes="32x32"\r
    />\r
    <link\r
      rel="icon"\r
      type="image/png"\r
      href="<%=backendUrl%>/plugins/documentation/favicon-16x16.png"\r
      sizes="16x16"\r
    />\r
    <style>\r
      html {\r
        box-sizing: border-box;\r
        overflow: -moz-scrollbars-vertical;\r
        overflow-y: scroll;\r
      }\r
\r
      *,\r
      *:before,\r
      *:after {\r
        box-sizing: inherit;\r
      }\r
\r
      body {\r
        margin: 0;\r
        background: #fafafa;\r
      }\r
    </style>\r
  </head>\r
\r
  <body>\r
    <div id="swagger-ui"></div>\r
    <script class="custom-swagger-ui">\r
      window.onload = function() {\r
        const ui = SwaggerUIBundle({\r
          url: "https://petstore.swagger.io/v2/swagger.json",\r
          spec: <%=spec%>,\r
          dom_id: '#swagger-ui',\r
          docExpansion: "none",\r
          deepLinking: true,\r
          presets: [\r
            SwaggerUIBundle.presets.apis,\r
            SwaggerUIStandalonePreset,\r
          ],\r
          plugins: [\r
            SwaggerUIBundle.plugins.DownloadUrl,\r
          ],\r
          layout: "StandaloneLayout",\r
        });\r
\r
        window.ui = ui;\r
      }\r
    <\/script>\r
\r
    <script src="<%=backendUrl%>/plugins/documentation/swagger-ui-bundle.js"><\/script>\r
    <script src="<%=backendUrl%>/plugins/documentation/swagger-ui-standalone-preset.js"><\/script>\r
  </body>\r
</html>\r
`;
exports.default = index;
