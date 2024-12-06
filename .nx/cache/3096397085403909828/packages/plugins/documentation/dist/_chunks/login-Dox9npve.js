"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const login = `<!DOCTYPE html>\r
<html>\r
  <head>\r
    <title>Login - Documentation</title>\r
    <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet" />\r
    <style>\r
      html {\r
        font-size: 62.5%;\r
        height: 100%;\r
        margin: 0;\r
        padding: 0;\r
      }\r
\r
      body {\r
        height: 100%;\r
        margin: 0;\r
        background-color: #ffffff;\r
        font-family: 'Lato';\r
        font-size: 1.4rem;\r
        font-weight: 400;\r
        text-rendering: optimizeLegibility;\r
        -webkit-font-smoothing: antialiased;\r
        -moz-osx-font-smoothing: grayscale;\r
      }\r
\r
      .login {\r
        height: 100%;\r
        background-color: #f6f9fc;\r
      }\r
\r
      .login .login-form {\r
        height: calc(100% - 70px);\r
        padding: 68px 0 0;\r
        text-align: center;\r
      }\r
\r
      .login .login-form form {\r
        position: relative;\r
        max-width: 460px;\r
        padding: 26px 30px;\r
        margin: 55px auto 0;\r
        background-color: #ffffff;\r
        border-radius: 3px;\r
        box-shadow: 0px 2px 4px rgba(91, 107, 174, 0.15);\r
        text-align: center;\r
      }\r
\r
      .login .login-form form:before {\r
        position: absolute;\r
        content: '';\r
        top: 0px;\r
        left: 0;\r
        display: inline-block;\r
        width: 100%;\r
        height: 2px;\r
        background-color: #2b66cc;\r
      }\r
\r
      .login .login-form form .error {\r
        display: block;\r
        color: #ff4e00;\r
        padding-bottom: 20px;\r
      }\r
\r
      .login .login-form .sub-title {\r
        margin-top: 35px;\r
        font-size: 1.6rem;\r
        font-weight: 400;\r
      }\r
\r
      .login .login-form .logo {\r
        max-height: 40px;\r
      }\r
\r
      .login .login-form form label {\r
        display: block;\r
        margin-bottom: 18px;\r
        width: 100%;\r
        text-align: left;\r
        font-weight: 600;\r
      }\r
\r
      .login .login-form form input {\r
        outline: none;\r
        width: calc(100% - 30px);\r
        height: 36px;\r
        padding: 0 15px;\r
        border: 1px solid #ececec;\r
        border-radius: 2px;\r
        margin-bottom: 20px;\r
        line-height: 36px;\r
        text-align: left;\r
      }\r
\r
      .login .login-form form input[type='submit'] {\r
        cursor: pointer;\r
        display: inline-block;\r
        width: auto;\r
        margin: 12px auto 0;\r
        padding: 0 75px;\r
        background: transparent;\r
        border-radius: 36px;\r
        border: 1px solid #2b66cc;\r
        color: #2b66cc;\r
        text-transform: uppercase;\r
        font-size: 1.4rem;\r
        font-weight: 700;\r
        transition: all 0.2s ease-out;\r
      }\r
\r
      .login .login-form form input[type='submit']:hover {\r
        background: #2b66cc;\r
        color: #ffffff;\r
      }\r
    </style>\r
  </head>\r
  <body>\r
    <div class="login">\r
      <section class="login-form">\r
        <div class="container">\r
          <div class="row">\r
            <div class="col-lg-6 col-lg-offset-3 col-md-12">\r
              <img\r
                alt="Strapi logo"\r
                class="logo"\r
                src="https://strapi.io/assets/images/logo_login.png"\r
              />\r
              <h2 class="sub-title">Enter the password to access the documentation.</h2>\r
              <form method="post" action="<%=actionUrl%>">\r
                <span class="error">Wrong password...</span>\r
                <label>Password</label>\r
                <input\r
                  type="password"\r
                  name="password"\r
                  placeholder="&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;"\r
                />\r
                <input type="submit" value="Login" />\r
              </form>\r
            </div>\r
          </div>\r
        </div>\r
      </section>\r
    </div>\r
  </body>\r
</html>\r
`;
exports.default = login;
