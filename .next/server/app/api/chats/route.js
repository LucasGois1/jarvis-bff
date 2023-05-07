"use strict";
(() => {
var exports = {};
exports.id = 947;
exports.ids = [947];
exports.modules = {

/***/ 7783:
/***/ ((module) => {

module.exports = require("next/dist/compiled/@edge-runtime/cookies");

/***/ }),

/***/ 8530:
/***/ ((module) => {

module.exports = require("next/dist/compiled/@opentelemetry/api");

/***/ }),

/***/ 4426:
/***/ ((module) => {

module.exports = require("next/dist/compiled/chalk");

/***/ }),

/***/ 252:
/***/ ((module) => {

module.exports = require("next/dist/compiled/cookie");

/***/ }),

/***/ 6939:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "headerHooks": () => (/* binding */ headerHooks),
  "originalPathname": () => (/* binding */ originalPathname),
  "requestAsyncStorage": () => (/* binding */ requestAsyncStorage),
  "routeModule": () => (/* binding */ routeModule),
  "serverHooks": () => (/* binding */ serverHooks),
  "staticGenerationAsyncStorage": () => (/* binding */ staticGenerationAsyncStorage),
  "staticGenerationBailout": () => (/* binding */ staticGenerationBailout)
});

// NAMESPACE OBJECT: ./src/app/api/chats/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  "GET": () => (GET),
  "POST": () => (POST)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(6145);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(9532);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ./src/app/prisma/prisma.ts + 1 modules
var prisma = __webpack_require__(1509);
// EXTERNAL MODULE: ./node_modules/next/dist/server/web/exports/next-response.js
var next_response = __webpack_require__(3804);
;// CONCATENATED MODULE: ./src/app/api/chats/route.ts


async function POST(request) {
    const body = await request.json();
    const chatCreated = await prisma/* prisma.chat.create */._.chat.create({
        data: {
            messages: {
                create: {
                    content: body.content
                }
            }
        },
        select: {
            id: true,
            messages: true,
            created_at: true
        }
    });
    return next_response/* default.json */.Z.json({
        chatCreated
    });
}
async function GET(request) {
    const chats = await prisma/* prisma.chat.findMany */._.chat.findMany({
        select: {
            id: true,
            messages: {
                orderBy: {
                    created_at: "desc"
                },
                take: 1
            },
            created_at: true
        },
        orderBy: {
            created_at: "desc"
        }
    });
    return next_response/* default.json */.Z.json({
        chats
    });
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fchats%2Froute&name=app%2Fapi%2Fchats%2Froute&pagePath=private-next-app-dir%2Fapi%2Fchats%2Froute.ts&appDir=%2FUsers%2Flucasgois%2Fprojects%2Fjarvis-bff%2Fsrc%2Fapp&appPaths=%2Fapi%2Fchats%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=!

    

    

    

    const routeModule = new (module_default())({
    userland: route_namespaceObject,
    pathname: "/api/chats",
    resolvedPagePath: "/Users/lucasgois/projects/jarvis-bff/src/app/api/chats/route.ts",
    nextConfigOutput: undefined,
  })

    // Pull out the exports that we need to expose from the module. This should
    // be eliminated when we've moved the other routes to the new format. These
    // are used to hook into the route.
    const {
      requestAsyncStorage,
      staticGenerationAsyncStorage,
      serverHooks,
      headerHooks,
      staticGenerationBailout
    } = routeModule

    const originalPathname = "/api/chats/route"

    

/***/ }),

/***/ 3804:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;
// This file is for modularized imports for next/server to get fully-treeshaking.

__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "Z", ({
    enumerable: true,
    get: function() {
        return _response.NextResponse;
    }
}));
const _response = __webpack_require__(6843); //# sourceMappingURL=next-response.js.map


/***/ }),

/***/ 1509:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "_": () => (/* binding */ prisma)
});

;// CONCATENATED MODULE: external "@prisma/client"
const client_namespaceObject = require("@prisma/client");
;// CONCATENATED MODULE: ./src/app/prisma/prisma.ts

const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new client_namespaceObject.PrismaClient();
if (false) {}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [79,601,843], () => (__webpack_exec__(6939)));
module.exports = __webpack_exports__;

})();