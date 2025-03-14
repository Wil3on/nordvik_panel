/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/nodes/[id]/check-connection/route";
exports.ids = ["app/api/nodes/[id]/check-connection/route"];
exports.modules = {

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler),\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   dynamic: () => (/* binding */ dynamic),\n/* harmony export */   runtime: () => (/* binding */ runtime)\n/* harmony export */ });\n/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/next */ \"(rsc)/./node_modules/next-auth/next/index.js\");\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\n// Mark this file as server-only - will not be included in client bundles\nconst dynamic = 'force-dynamic';\nconst runtime = 'nodejs'; // Force Node.js runtime\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_2__.PrismaClient();\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    return null;\n                }\n                const user = await prisma.user.findUnique({\n                    where: {\n                        email: credentials.email\n                    }\n                });\n                if (!user) {\n                    return null;\n                }\n                const isPasswordValid = await bcrypt__WEBPACK_IMPORTED_MODULE_3__.compare(credentials.password, user.password);\n                if (!isPasswordValid) {\n                    return null;\n                }\n                return {\n                    id: user.id,\n                    name: user.name,\n                    email: user.email,\n                    role: user.role\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                return {\n                    ...token,\n                    id: user.id,\n                    role: user.role\n                };\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            return {\n                ...session,\n                user: {\n                    ...session.user,\n                    id: token.id,\n                    role: token.role\n                }\n            };\n        }\n    },\n    pages: {\n        signIn: \"/login\"\n    },\n    session: {\n        strategy: \"jwt\"\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\nconst handler = (0,next_auth_next__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNzQztBQUM0QjtBQUNwQjtBQUNYO0FBRW5DLHlFQUF5RTtBQUNsRSxNQUFNSSxVQUFVLGdCQUFnQjtBQUNoQyxNQUFNQyxVQUFVLFNBQVMsQ0FBQyx3QkFBd0I7QUFFekQsTUFBTUMsU0FBUyxJQUFJSix3REFBWUE7QUF1QnhCLE1BQU1LLGNBQStCO0lBQzFDQyxXQUFXO1FBQ1RQLDJFQUFtQkEsQ0FBQztZQUNsQlEsTUFBTTtZQUNOQyxhQUFhO2dCQUNYQyxPQUFPO29CQUFFQyxPQUFPO29CQUFTQyxNQUFNO2dCQUFRO2dCQUN2Q0MsVUFBVTtvQkFBRUYsT0FBTztvQkFBWUMsTUFBTTtnQkFBVztZQUNsRDtZQUNBLE1BQU1FLFdBQVVMLFdBQVc7Z0JBQ3pCLElBQUksQ0FBQ0EsYUFBYUMsU0FBUyxDQUFDRCxhQUFhSSxVQUFVO29CQUNqRCxPQUFPO2dCQUNUO2dCQUVBLE1BQU1FLE9BQU8sTUFBTVYsT0FBT1UsSUFBSSxDQUFDQyxVQUFVLENBQUM7b0JBQ3hDQyxPQUFPO3dCQUNMUCxPQUFPRCxZQUFZQyxLQUFLO29CQUMxQjtnQkFDRjtnQkFFQSxJQUFJLENBQUNLLE1BQU07b0JBQ1QsT0FBTztnQkFDVDtnQkFFQSxNQUFNRyxrQkFBa0IsTUFBTWhCLDJDQUFnQixDQUM1Q08sWUFBWUksUUFBUSxFQUNwQkUsS0FBS0YsUUFBUTtnQkFHZixJQUFJLENBQUNLLGlCQUFpQjtvQkFDcEIsT0FBTztnQkFDVDtnQkFFQSxPQUFPO29CQUNMRSxJQUFJTCxLQUFLSyxFQUFFO29CQUNYWixNQUFNTyxLQUFLUCxJQUFJO29CQUNmRSxPQUFPSyxLQUFLTCxLQUFLO29CQUNqQlcsTUFBTU4sS0FBS00sSUFBSTtnQkFDakI7WUFDRjtRQUNGO0tBQ0Q7SUFDREMsV0FBVztRQUNULE1BQU1DLEtBQUksRUFBRUMsS0FBSyxFQUFFVCxJQUFJLEVBQUU7WUFDdkIsSUFBSUEsTUFBTTtnQkFDUixPQUFPO29CQUNMLEdBQUdTLEtBQUs7b0JBQ1JKLElBQUlMLEtBQUtLLEVBQUU7b0JBQ1hDLE1BQU1OLEtBQUtNLElBQUk7Z0JBQ2pCO1lBQ0Y7WUFDQSxPQUFPRztRQUNUO1FBQ0EsTUFBTUMsU0FBUSxFQUFFQSxPQUFPLEVBQUVELEtBQUssRUFBRTtZQUM5QixPQUFPO2dCQUNMLEdBQUdDLE9BQU87Z0JBQ1ZWLE1BQU07b0JBQ0osR0FBR1UsUUFBUVYsSUFBSTtvQkFDZkssSUFBSUksTUFBTUosRUFBRTtvQkFDWkMsTUFBTUcsTUFBTUgsSUFBSTtnQkFDbEI7WUFDRjtRQUNGO0lBQ0Y7SUFDQUssT0FBTztRQUNMQyxRQUFRO0lBQ1Y7SUFDQUYsU0FBUztRQUNQRyxVQUFVO0lBQ1o7SUFDQUMsUUFBUUMsUUFBUUMsR0FBRyxDQUFDQyxlQUFlO0FBQ3JDLEVBQUU7QUFFRixNQUFNQyxVQUFVbEMsMERBQVFBLENBQUNPO0FBRWtCIiwic291cmNlcyI6WyJEOlxcUHJvamVjdHNcXG5vcmR2aWtcXG5vcmR2aWtfcGFuZWxcXGFwcFxcYXBpXFxhdXRoXFxbLi4ubmV4dGF1dGhdXFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXV0aE9wdGlvbnMgfSBmcm9tIFwibmV4dC1hdXRoXCI7XG5pbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aC9uZXh0XCI7XG5pbXBvcnQgQ3JlZGVudGlhbHNQcm92aWRlciBmcm9tIFwibmV4dC1hdXRoL3Byb3ZpZGVycy9jcmVkZW50aWFsc1wiO1xuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5pbXBvcnQgKiBhcyBiY3J5cHRqcyBmcm9tIFwiYmNyeXB0XCI7XG5cbi8vIE1hcmsgdGhpcyBmaWxlIGFzIHNlcnZlci1vbmx5IC0gd2lsbCBub3QgYmUgaW5jbHVkZWQgaW4gY2xpZW50IGJ1bmRsZXNcbmV4cG9ydCBjb25zdCBkeW5hbWljID0gJ2ZvcmNlLWR5bmFtaWMnO1xuZXhwb3J0IGNvbnN0IHJ1bnRpbWUgPSAnbm9kZWpzJzsgLy8gRm9yY2UgTm9kZS5qcyBydW50aW1lXG5cbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuLy8gRXh0ZW5kIHRoZSBkZWZhdWx0IHNlc3Npb24gYW5kIHVzZXIgdHlwZXNcbmRlY2xhcmUgbW9kdWxlIFwibmV4dC1hdXRoXCIge1xuICBpbnRlcmZhY2UgU2Vzc2lvbiB7XG4gICAgdXNlcjoge1xuICAgICAgaWQ6IHN0cmluZztcbiAgICAgIG5hbWU/OiBzdHJpbmcgfCBudWxsO1xuICAgICAgZW1haWw/OiBzdHJpbmcgfCBudWxsO1xuICAgICAgaW1hZ2U/OiBzdHJpbmcgfCBudWxsO1xuICAgICAgcm9sZT86IHN0cmluZyB8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgaW50ZXJmYWNlIFVzZXIge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbmFtZT86IHN0cmluZyB8IG51bGw7XG4gICAgZW1haWw/OiBzdHJpbmcgfCBudWxsO1xuICAgIGltYWdlPzogc3RyaW5nIHwgbnVsbDtcbiAgICByb2xlPzogc3RyaW5nIHwgbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ3JlZGVudGlhbHNQcm92aWRlcih7XG4gICAgICBuYW1lOiBcImNyZWRlbnRpYWxzXCIsXG4gICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICBlbWFpbDogeyBsYWJlbDogXCJFbWFpbFwiLCB0eXBlOiBcImVtYWlsXCIgfSxcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6IFwiUGFzc3dvcmRcIiwgdHlwZTogXCJwYXNzd29yZFwiIH0sXG4gICAgICB9LFxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcbiAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgZW1haWw6IGNyZWRlbnRpYWxzLmVtYWlsLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNQYXNzd29yZFZhbGlkID0gYXdhaXQgYmNyeXB0anMuY29tcGFyZShcbiAgICAgICAgICBjcmVkZW50aWFscy5wYXNzd29yZCxcbiAgICAgICAgICB1c2VyLnBhc3N3b3JkXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKCFpc1Bhc3N3b3JkVmFsaWQpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxuICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgIHJvbGU6IHVzZXIucm9sZSBhcyBzdHJpbmcsXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBjYWxsYmFja3M6IHtcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnRva2VuLFxuICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgIHJvbGU6IHVzZXIucm9sZSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zZXNzaW9uLFxuICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgLi4uc2Vzc2lvbi51c2VyLFxuICAgICAgICAgIGlkOiB0b2tlbi5pZCxcbiAgICAgICAgICByb2xlOiB0b2tlbi5yb2xlLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuICBwYWdlczoge1xuICAgIHNpZ25JbjogXCIvbG9naW5cIixcbiAgfSxcbiAgc2Vzc2lvbjoge1xuICAgIHN0cmF0ZWd5OiBcImp3dFwiLFxuICB9LFxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCxcbn07XG5cbmNvbnN0IGhhbmRsZXIgPSBOZXh0QXV0aChhdXRoT3B0aW9ucyk7XG5cbmV4cG9ydCB7IGhhbmRsZXIgYXMgR0VULCBoYW5kbGVyIGFzIFBPU1QgfTtcbiJdLCJuYW1lcyI6WyJOZXh0QXV0aCIsIkNyZWRlbnRpYWxzUHJvdmlkZXIiLCJQcmlzbWFDbGllbnQiLCJiY3J5cHRqcyIsImR5bmFtaWMiLCJydW50aW1lIiwicHJpc21hIiwiYXV0aE9wdGlvbnMiLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlzUGFzc3dvcmRWYWxpZCIsImNvbXBhcmUiLCJpZCIsInJvbGUiLCJjYWxsYmFja3MiLCJqd3QiLCJ0b2tlbiIsInNlc3Npb24iLCJwYWdlcyIsInNpZ25JbiIsInN0cmF0ZWd5Iiwic2VjcmV0IiwicHJvY2VzcyIsImVudiIsIk5FWFRBVVRIX1NFQ1JFVCIsImhhbmRsZXIiLCJHRVQiLCJQT1NUIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./app/api/nodes/[id]/check-connection/route.ts":
/*!******************************************************!*\
  !*** ./app/api/nodes/[id]/check-connection/route.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _app_api_auth_nextauth_route__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/app/api/auth/[...nextauth]/route */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! node-fetch */ \"(rsc)/./node_modules/node-fetch/lib/index.mjs\");\n\n\n\n\n\n// POST /api/nodes/[id]/check-connection\nasync function POST(request, { params }) {\n    try {\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_app_api_auth_nextauth_route__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n        if (!session) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Unauthorized\"\n            }, {\n                status: 401\n            });\n        }\n        // Ensure params is awaited before accessing its properties\n        const { id: nodeId } = params;\n        // Fetch the node details to get IP address and port\n        const node = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].node.findUnique({\n            where: {\n                id: nodeId\n            }\n        });\n        if (!node) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Node not found\"\n            }, {\n                status: 404\n            });\n        }\n        try {\n            // Attempt to connect to the node's health endpoint with the correct path\n            // The node app exposes the health endpoint at /health (not at /api/system/health)\n            const nodeUrl = `http://${node.ipAddress}:${node.port}/health`;\n            // Get the authentication token from the node record\n            const authToken = node.authToken;\n            if (!authToken) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    connected: false,\n                    message: \"No authentication token found for this node\"\n                });\n            }\n            const response = await (0,node_fetch__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(nodeUrl, {\n                method: 'GET',\n                // No authentication needed for health endpoint\n                timeout: 5000\n            });\n            if (response.ok) {\n                // If connection is successful, update the node status to ONLINE\n                await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].node.update({\n                    where: {\n                        id: nodeId\n                    },\n                    data: {\n                        status: \"ONLINE\"\n                    }\n                });\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    connected: true,\n                    message: \"Successfully connected to node\"\n                });\n            } else {\n                // If connection unsuccessful but we got a response, get the error message\n                let errorMessage;\n                try {\n                    const errorData = await response.json();\n                    errorMessage = errorData.error || \"Failed to connect to node\";\n                } catch (e) {\n                    errorMessage = \"Failed to connect to node\";\n                }\n                // Update the node status to OFFLINE\n                await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].node.update({\n                    where: {\n                        id: nodeId\n                    },\n                    data: {\n                        status: \"OFFLINE\"\n                    }\n                });\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    connected: false,\n                    message: errorMessage\n                });\n            }\n        } catch (error) {\n            console.error(\"Node connection error:\", error);\n            // Update the node status to OFFLINE\n            await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].node.update({\n                where: {\n                    id: nodeId\n                },\n                data: {\n                    status: \"OFFLINE\"\n                }\n            });\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                connected: false,\n                message: \"Failed to connect to node: \" + error.message\n            });\n        }\n    } catch (error) {\n        console.error(\"Error checking node connection:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL25vZGVzL1tpZF0vY2hlY2stY29ubmVjdGlvbi9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQXdEO0FBQ1g7QUFDb0I7QUFDL0I7QUFDSDtBQUUvQix3Q0FBd0M7QUFDakMsZUFBZUssS0FDcEJDLE9BQW9CLEVBQ3BCLEVBQUVDLE1BQU0sRUFBOEI7SUFFdEMsSUFBSTtRQUNGLE1BQU1DLFVBQVUsTUFBTVAsMkRBQWdCQSxDQUFDQyxxRUFBV0E7UUFFbEQsSUFBSSxDQUFDTSxTQUFTO1lBQ1osT0FBT1IscURBQVlBLENBQUNTLElBQUksQ0FDdEI7Z0JBQUVDLE9BQU87WUFBZSxHQUN4QjtnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsMkRBQTJEO1FBQzNELE1BQU0sRUFBRUMsSUFBSUMsTUFBTSxFQUFFLEdBQUdOO1FBRXZCLG9EQUFvRDtRQUNwRCxNQUFNTyxPQUFPLE1BQU1YLG1EQUFNQSxDQUFDVyxJQUFJLENBQUNDLFVBQVUsQ0FBQztZQUN4Q0MsT0FBTztnQkFDTEosSUFBSUM7WUFDTjtRQUNGO1FBRUEsSUFBSSxDQUFDQyxNQUFNO1lBQ1QsT0FBT2QscURBQVlBLENBQUNTLElBQUksQ0FDdEI7Z0JBQUVDLE9BQU87WUFBaUIsR0FDMUI7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLElBQUk7WUFDRix5RUFBeUU7WUFDekUsa0ZBQWtGO1lBQ2xGLE1BQU1NLFVBQVUsQ0FBQyxPQUFPLEVBQUVILEtBQUtJLFNBQVMsQ0FBQyxDQUFDLEVBQUVKLEtBQUtLLElBQUksQ0FBQyxPQUFPLENBQUM7WUFFOUQsb0RBQW9EO1lBQ3BELE1BQU1DLFlBQVlOLEtBQUtNLFNBQVM7WUFFaEMsSUFBSSxDQUFDQSxXQUFXO2dCQUNkLE9BQU9wQixxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO29CQUN2QlksV0FBVztvQkFDWEMsU0FBUztnQkFDWDtZQUNGO1lBRUEsTUFBTUMsV0FBVyxNQUFNbkIsc0RBQUtBLENBQUNhLFNBQVM7Z0JBQ3BDTyxRQUFRO2dCQUNSLCtDQUErQztnQkFDL0NDLFNBQVM7WUFDWDtZQUVBLElBQUlGLFNBQVNHLEVBQUUsRUFBRTtnQkFDZixnRUFBZ0U7Z0JBQ2hFLE1BQU12QixtREFBTUEsQ0FBQ1csSUFBSSxDQUFDYSxNQUFNLENBQUM7b0JBQ3ZCWCxPQUFPO3dCQUFFSixJQUFJQztvQkFBTztvQkFDcEJlLE1BQU07d0JBQUVqQixRQUFRO29CQUFTO2dCQUMzQjtnQkFFQSxPQUFPWCxxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO29CQUN2QlksV0FBVztvQkFDWEMsU0FBUztnQkFDWDtZQUNGLE9BQU87Z0JBQ0wsMEVBQTBFO2dCQUMxRSxJQUFJTztnQkFDSixJQUFJO29CQUNGLE1BQU1DLFlBQVksTUFBTVAsU0FBU2QsSUFBSTtvQkFDckNvQixlQUFlQyxVQUFVcEIsS0FBSyxJQUFJO2dCQUNwQyxFQUFFLE9BQU9xQixHQUFHO29CQUNWRixlQUFlO2dCQUNqQjtnQkFFQSxvQ0FBb0M7Z0JBQ3BDLE1BQU0xQixtREFBTUEsQ0FBQ1csSUFBSSxDQUFDYSxNQUFNLENBQUM7b0JBQ3ZCWCxPQUFPO3dCQUFFSixJQUFJQztvQkFBTztvQkFDcEJlLE1BQU07d0JBQUVqQixRQUFRO29CQUFVO2dCQUM1QjtnQkFFQSxPQUFPWCxxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO29CQUN2QlksV0FBVztvQkFDWEMsU0FBU087Z0JBQ1g7WUFDRjtRQUNGLEVBQUUsT0FBT25CLE9BQVk7WUFDbkJzQixRQUFRdEIsS0FBSyxDQUFDLDBCQUEwQkE7WUFFeEMsb0NBQW9DO1lBQ3BDLE1BQU1QLG1EQUFNQSxDQUFDVyxJQUFJLENBQUNhLE1BQU0sQ0FBQztnQkFDdkJYLE9BQU87b0JBQUVKLElBQUlDO2dCQUFPO2dCQUNwQmUsTUFBTTtvQkFBRWpCLFFBQVE7Z0JBQVU7WUFDNUI7WUFFQSxPQUFPWCxxREFBWUEsQ0FBQ1MsSUFBSSxDQUFDO2dCQUN2QlksV0FBVztnQkFDWEMsU0FBUyxnQ0FBZ0NaLE1BQU1ZLE9BQU87WUFDeEQ7UUFDRjtJQUNGLEVBQUUsT0FBT1osT0FBWTtRQUNuQnNCLFFBQVF0QixLQUFLLENBQUMsbUNBQW1DQTtRQUNqRCxPQUFPVixxREFBWUEsQ0FBQ1MsSUFBSSxDQUN0QjtZQUFFQyxPQUFPO1FBQXdCLEdBQ2pDO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyJEOlxcUHJvamVjdHNcXG5vcmR2aWtcXG5vcmR2aWtfcGFuZWxcXGFwcFxcYXBpXFxub2Rlc1xcW2lkXVxcY2hlY2stY29ubmVjdGlvblxccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gXCJuZXh0LWF1dGhcIjtcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSBcIkAvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIjtcbmltcG9ydCBwcmlzbWEgZnJvbSBcIkAvbGliL3ByaXNtYVwiO1xuaW1wb3J0IGZldGNoIGZyb20gJ25vZGUtZmV0Y2gnO1xuXG4vLyBQT1NUIC9hcGkvbm9kZXMvW2lkXS9jaGVjay1jb25uZWN0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChcbiAgcmVxdWVzdDogTmV4dFJlcXVlc3QsXG4gIHsgcGFyYW1zIH06IHsgcGFyYW1zOiB7IGlkOiBzdHJpbmcgfSB9XG4pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG4gICAgXG4gICAgaWYgKCFzZXNzaW9uKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMSB9XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIEVuc3VyZSBwYXJhbXMgaXMgYXdhaXRlZCBiZWZvcmUgYWNjZXNzaW5nIGl0cyBwcm9wZXJ0aWVzXG4gICAgY29uc3QgeyBpZDogbm9kZUlkIH0gPSBwYXJhbXM7XG4gICAgXG4gICAgLy8gRmV0Y2ggdGhlIG5vZGUgZGV0YWlscyB0byBnZXQgSVAgYWRkcmVzcyBhbmQgcG9ydFxuICAgIGNvbnN0IG5vZGUgPSBhd2FpdCBwcmlzbWEubm9kZS5maW5kVW5pcXVlKHtcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIGlkOiBub2RlSWQsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiTm9kZSBub3QgZm91bmRcIiB9LFxuICAgICAgICB7IHN0YXR1czogNDA0IH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIEF0dGVtcHQgdG8gY29ubmVjdCB0byB0aGUgbm9kZSdzIGhlYWx0aCBlbmRwb2ludCB3aXRoIHRoZSBjb3JyZWN0IHBhdGhcbiAgICAgIC8vIFRoZSBub2RlIGFwcCBleHBvc2VzIHRoZSBoZWFsdGggZW5kcG9pbnQgYXQgL2hlYWx0aCAobm90IGF0IC9hcGkvc3lzdGVtL2hlYWx0aClcbiAgICAgIGNvbnN0IG5vZGVVcmwgPSBgaHR0cDovLyR7bm9kZS5pcEFkZHJlc3N9OiR7bm9kZS5wb3J0fS9oZWFsdGhgO1xuICAgICAgXG4gICAgICAvLyBHZXQgdGhlIGF1dGhlbnRpY2F0aW9uIHRva2VuIGZyb20gdGhlIG5vZGUgcmVjb3JkXG4gICAgICBjb25zdCBhdXRoVG9rZW4gPSBub2RlLmF1dGhUb2tlbjtcbiAgICAgIFxuICAgICAgaWYgKCFhdXRoVG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgICAgICBjb25uZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiTm8gYXV0aGVudGljYXRpb24gdG9rZW4gZm91bmQgZm9yIHRoaXMgbm9kZVwiXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKG5vZGVVcmwsIHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgLy8gTm8gYXV0aGVudGljYXRpb24gbmVlZGVkIGZvciBoZWFsdGggZW5kcG9pbnRcbiAgICAgICAgdGltZW91dDogNTAwMFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAvLyBJZiBjb25uZWN0aW9uIGlzIHN1Y2Nlc3NmdWwsIHVwZGF0ZSB0aGUgbm9kZSBzdGF0dXMgdG8gT05MSU5FXG4gICAgICAgIGF3YWl0IHByaXNtYS5ub2RlLnVwZGF0ZSh7XG4gICAgICAgICAgd2hlcmU6IHsgaWQ6IG5vZGVJZCB9LFxuICAgICAgICAgIGRhdGE6IHsgc3RhdHVzOiBcIk9OTElORVwiIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgICAgICBjb25uZWN0ZWQ6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJTdWNjZXNzZnVsbHkgY29ubmVjdGVkIHRvIG5vZGVcIlxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIGNvbm5lY3Rpb24gdW5zdWNjZXNzZnVsIGJ1dCB3ZSBnb3QgYSByZXNwb25zZSwgZ2V0IHRoZSBlcnJvciBtZXNzYWdlXG4gICAgICAgIGxldCBlcnJvck1lc3NhZ2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgZXJyb3JEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGVycm9yRGF0YS5lcnJvciB8fCBcIkZhaWxlZCB0byBjb25uZWN0IHRvIG5vZGVcIjtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGVycm9yTWVzc2FnZSA9IFwiRmFpbGVkIHRvIGNvbm5lY3QgdG8gbm9kZVwiO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBVcGRhdGUgdGhlIG5vZGUgc3RhdHVzIHRvIE9GRkxJTkVcbiAgICAgICAgYXdhaXQgcHJpc21hLm5vZGUudXBkYXRlKHtcbiAgICAgICAgICB3aGVyZTogeyBpZDogbm9kZUlkIH0sXG4gICAgICAgICAgZGF0YTogeyBzdGF0dXM6IFwiT0ZGTElORVwiIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgICAgICAgIGNvbm5lY3RlZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogZXJyb3JNZXNzYWdlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJOb2RlIGNvbm5lY3Rpb24gZXJyb3I6XCIsIGVycm9yKTtcbiAgICAgIFxuICAgICAgLy8gVXBkYXRlIHRoZSBub2RlIHN0YXR1cyB0byBPRkZMSU5FXG4gICAgICBhd2FpdCBwcmlzbWEubm9kZS51cGRhdGUoe1xuICAgICAgICB3aGVyZTogeyBpZDogbm9kZUlkIH0sXG4gICAgICAgIGRhdGE6IHsgc3RhdHVzOiBcIk9GRkxJTkVcIiB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgICAgY29ubmVjdGVkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJGYWlsZWQgdG8gY29ubmVjdCB0byBub2RlOiBcIiArIGVycm9yLm1lc3NhZ2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBjaGVja2luZyBub2RlIGNvbm5lY3Rpb246XCIsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiBcIkludGVybmFsIHNlcnZlciBlcnJvclwiIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0U2VydmVyU2Vzc2lvbiIsImF1dGhPcHRpb25zIiwicHJpc21hIiwiZmV0Y2giLCJQT1NUIiwicmVxdWVzdCIsInBhcmFtcyIsInNlc3Npb24iLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJpZCIsIm5vZGVJZCIsIm5vZGUiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJub2RlVXJsIiwiaXBBZGRyZXNzIiwicG9ydCIsImF1dGhUb2tlbiIsImNvbm5lY3RlZCIsIm1lc3NhZ2UiLCJyZXNwb25zZSIsIm1ldGhvZCIsInRpbWVvdXQiLCJvayIsInVwZGF0ZSIsImRhdGEiLCJlcnJvck1lc3NhZ2UiLCJlcnJvckRhdGEiLCJlIiwiY29uc29sZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/nodes/[id]/check-connection/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\n// Prevents multiple instances of Prisma Client in development\nconst globalForPrisma = global;\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5Qyw4REFBOEQ7QUFDOUQsTUFBTUMsa0JBQWtCQztBQUV4QixNQUFNQyxTQUFTRixnQkFBZ0JFLE1BQU0sSUFBSSxJQUFJSCx3REFBWUE7QUFFekQsSUFBSUksSUFBcUMsRUFBRUgsZ0JBQWdCRSxNQUFNLEdBQUdBO0FBRXBFLGlFQUFlQSxNQUFNQSxFQUFDIiwic291cmNlcyI6WyJEOlxcUHJvamVjdHNcXG5vcmR2aWtcXG5vcmR2aWtfcGFuZWxcXGxpYlxccHJpc21hLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcblxuLy8gUHJldmVudHMgbXVsdGlwbGUgaW5zdGFuY2VzIG9mIFByaXNtYSBDbGllbnQgaW4gZGV2ZWxvcG1lbnRcbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbCBhcyB1bmtub3duIGFzIHsgcHJpc21hOiBQcmlzbWFDbGllbnQgfTtcblxuY29uc3QgcHJpc21hID0gZ2xvYmFsRm9yUHJpc21hLnByaXNtYSB8fCBuZXcgUHJpc21hQ2xpZW50KCk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hO1xuXG5leHBvcnQgZGVmYXVsdCBwcmlzbWE7XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiZ2xvYmFsRm9yUHJpc21hIiwiZ2xvYmFsIiwicHJpc21hIiwicHJvY2VzcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnodes%2F%5Bid%5D%2Fcheck-connection%2Froute&page=%2Fapi%2Fnodes%2F%5Bid%5D%2Fcheck-connection%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnodes%2F%5Bid%5D%2Fcheck-connection%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnodes%2F%5Bid%5D%2Fcheck-connection%2Froute&page=%2Fapi%2Fnodes%2F%5Bid%5D%2Fcheck-connection%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnodes%2F%5Bid%5D%2Fcheck-connection%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Projects_nordvik_nordvik_panel_app_api_nodes_id_check_connection_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/nodes/[id]/check-connection/route.ts */ \"(rsc)/./app/api/nodes/[id]/check-connection/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/nodes/[id]/check-connection/route\",\n        pathname: \"/api/nodes/[id]/check-connection\",\n        filename: \"route\",\n        bundlePath: \"app/api/nodes/[id]/check-connection/route\"\n    },\n    resolvedPagePath: \"D:\\\\Projects\\\\nordvik\\\\nordvik_panel\\\\app\\\\api\\\\nodes\\\\[id]\\\\check-connection\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Projects_nordvik_nordvik_panel_app_api_nodes_id_check_connection_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZub2RlcyUyRiU1QmlkJTVEJTJGY2hlY2stY29ubmVjdGlvbiUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGbm9kZXMlMkYlNUJpZCU1RCUyRmNoZWNrLWNvbm5lY3Rpb24lMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZub2RlcyUyRiU1QmlkJTVEJTJGY2hlY2stY29ubmVjdGlvbiUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDUHJvamVjdHMlNUNub3JkdmlrJTVDbm9yZHZpa19wYW5lbCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9RCUzQSU1Q1Byb2plY3RzJTVDbm9yZHZpayU1Q25vcmR2aWtfcGFuZWwmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ3VDO0FBQ3BIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJEOlxcXFxQcm9qZWN0c1xcXFxub3JkdmlrXFxcXG5vcmR2aWtfcGFuZWxcXFxcYXBwXFxcXGFwaVxcXFxub2Rlc1xcXFxbaWRdXFxcXGNoZWNrLWNvbm5lY3Rpb25cXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL25vZGVzL1tpZF0vY2hlY2stY29ubmVjdGlvbi9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL25vZGVzL1tpZF0vY2hlY2stY29ubmVjdGlvblwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvbm9kZXMvW2lkXS9jaGVjay1jb25uZWN0aW9uL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiRDpcXFxcUHJvamVjdHNcXFxcbm9yZHZpa1xcXFxub3JkdmlrX3BhbmVsXFxcXGFwcFxcXFxhcGlcXFxcbm9kZXNcXFxcW2lkXVxcXFxjaGVjay1jb25uZWN0aW9uXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnodes%2F%5Bid%5D%2Fcheck-connection%2Froute&page=%2Fapi%2Fnodes%2F%5Bid%5D%2Fcheck-connection%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnodes%2F%5Bid%5D%2Fcheck-connection%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva","vendor-chunks/whatwg-url","vendor-chunks/tr46","vendor-chunks/node-fetch","vendor-chunks/webidl-conversions"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnodes%2F%5Bid%5D%2Fcheck-connection%2Froute&page=%2Fapi%2Fnodes%2F%5Bid%5D%2Fcheck-connection%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnodes%2F%5Bid%5D%2Fcheck-connection%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();