"use strict";
(() => {
var exports = {};
exports.id = 604;
exports.ids = [604];
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

/***/ 9523:
/***/ ((module) => {

module.exports = require("dns");

/***/ }),

/***/ 2361:
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 5158:
/***/ ((module) => {

module.exports = require("http2");

/***/ }),

/***/ 1808:
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 2781:
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ 4404:
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ 7310:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ 9796:
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ 2293:
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

// NAMESPACE OBJECT: ./src/app/api/messages/[messageId]/events/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  "GET": () => (GET)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(6145);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(9532);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ./src/app/prisma/prisma.ts + 1 modules
var prisma = __webpack_require__(1509);
// EXTERNAL MODULE: ./node_modules/@grpc/grpc-js/build/src/index.js
var src = __webpack_require__(4201);
// EXTERNAL MODULE: ./node_modules/@grpc/proto-loader/build/src/index.js
var build_src = __webpack_require__(2856);
// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(1017);
var external_path_default = /*#__PURE__*/__webpack_require__.n(external_path_);
;// CONCATENATED MODULE: ./src/grpc/client.ts



const packageDefinition = build_src/* loadSync */.J_(external_path_default().resolve(process.cwd(), "proto", "chat.proto"));
const proto = src/* loadPackageDefinition */.Rz(packageDefinition);
const client = new proto.pb.ChatService(process.env.GRPC_SERVER_URL, src/* credentials.createInsecure */.K9.createInsecure());

;// CONCATENATED MODULE: ./src/grpc/chat-service-client.ts


class ChatServiceClient {
    constructor(client, metadata){
        this.client = client;
        this.metadata = metadata;
    }
    chatStream(data) {
        const stream = this.client.chatStream({
            chatId: data.chat_id,
            userId: data.user_id,
            userMessage: data.content
        }, this.metadata);
        return stream;
    }
}
class ChatServiceClientFactory {
    static create() {
        const meta = new src/* Metadata */.SF();
        meta.add("authorization", process.env.GRPC_TOKEN);
        return new ChatServiceClient(client, meta);
    }
}

;// CONCATENATED MODULE: ./src/utils/stream/writer.ts
function writeOnStream(writer, event, data) {
    const encoder = new TextEncoder();
    const id = new Date().getMilliseconds();
    writer.write(encoder.encode(`id: ${id}\n`));
    writer.write(encoder.encode(`event: ${event}\n`));
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}

;// CONCATENATED MODULE: ./src/app/api/messages/[messageId]/events/route.ts



async function GET(request, { params  }) {
    const { messageId  } = params;
    const message = await prisma/* prisma.message.findUniqueOrThrow */._.message.findUniqueOrThrow({
        where: {
            id: messageId
        },
        include: {
            Chat: true
        }
    });
    const transformStream = new TransformStream();
    const writer = transformStream.writable.getWriter();
    if (message.has_ansered) {
        setTimeout(()=>{
            writeOnStream(writer, "error", "Message already answered");
            writer.close();
        }, 100);
        return response(transformStream, 403);
    }
    if (message.is_from_bot) {
        setTimeout(()=>{
            writeOnStream(writer, "error", "Message is from bot");
            writer.close();
        }, 100);
        return response(transformStream, 403);
    }
    const chatServiceClient = ChatServiceClientFactory.create();
    let messageReceived = null;
    chatServiceClient.chatStream({
        chat_id: message.Chat.remote_chat_id,
        user_id: "1",
        content: message.content
    }).on("data", (data)=>{
        messageReceived = data;
        writeOnStream(writer, "message", data);
    }).on("error", async (error)=>{
        writeOnStream(writer, "error", error);
        await writer.close();
    }).on("end", async ()=>{
        if (!messageReceived) writeOnStream(writer, "error", "No message received");
        const [newMessage] = await prisma/* prisma.$transaction */._.$transaction([
            prisma/* prisma.message.create */._.message.create({
                data: {
                    content: messageReceived.content,
                    chat_id: message.chat_id,
                    has_ansered: true,
                    is_from_bot: true
                }
            }),
            prisma/* prisma.chat.update */._.chat.update({
                where: {
                    id: message.chat_id
                },
                data: {
                    remote_chat_id: messageReceived.chatId
                }
            }),
            prisma/* prisma.message.update */._.message.update({
                where: {
                    id: message.id
                },
                data: {
                    has_ansered: true
                }
            })
        ]);
        writeOnStream(writer, "end", newMessage);
        await writer.close();
    });
    return response(transformStream);
}
function response(transformStream, status = 200) {
    return new Response(transformStream.readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        },
        status
    });
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fmessages%2F%5BmessageId%5D%2Fevents%2Froute&name=app%2Fapi%2Fmessages%2F%5BmessageId%5D%2Fevents%2Froute&pagePath=private-next-app-dir%2Fapi%2Fmessages%2F%5BmessageId%5D%2Fevents%2Froute.ts&appDir=%2FUsers%2Flucasgois%2Fprojects%2Fjarvis-bff%2Fsrc%2Fapp&appPaths=%2Fapi%2Fmessages%2F%5BmessageId%5D%2Fevents%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=!

    

    

    

    const routeModule = new (module_default())({
    userland: route_namespaceObject,
    pathname: "/api/messages/[messageId]/events",
    resolvedPagePath: "/Users/lucasgois/projects/jarvis-bff/src/app/api/messages/[messageId]/events/route.ts",
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

    const originalPathname = "/api/messages/[messageId]/events/route"

    

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
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [79,601,201], () => (__webpack_exec__(2293)));
module.exports = __webpack_exports__;

})();