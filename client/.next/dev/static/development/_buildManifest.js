self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/auth/signup": [
    "static/chunks/pages/auth/signup.js"
  ],
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/api/:path*"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/auth/signin",
    "/auth/signout",
    "/auth/signup",
    "/tickets/new"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()