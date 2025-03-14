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
exports.id = "app/api/nodes/route";
exports.ids = ["app/api/nodes/route"];
exports.modules = {

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler),\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   dynamic: () => (/* binding */ dynamic),\n/* harmony export */   runtime: () => (/* binding */ runtime)\n/* harmony export */ });\n/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/next */ \"(rsc)/./node_modules/next-auth/next/index.js\");\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\n// Mark this file as server-only - will not be included in client bundles\nconst dynamic = 'force-dynamic';\nconst runtime = 'nodejs'; // Force Node.js runtime\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_2__.PrismaClient();\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    return null;\n                }\n                const user = await prisma.user.findUnique({\n                    where: {\n                        email: credentials.email\n                    }\n                });\n                if (!user) {\n                    return null;\n                }\n                const isPasswordValid = await bcrypt__WEBPACK_IMPORTED_MODULE_3__.compare(credentials.password, user.password);\n                if (!isPasswordValid) {\n                    return null;\n                }\n                return {\n                    id: user.id,\n                    name: user.name,\n                    email: user.email,\n                    role: user.role\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                return {\n                    ...token,\n                    id: user.id,\n                    role: user.role\n                };\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            return {\n                ...session,\n                user: {\n                    ...session.user,\n                    id: token.id,\n                    role: token.role\n                }\n            };\n        }\n    },\n    pages: {\n        signIn: \"/login\"\n    },\n    session: {\n        strategy: \"jwt\"\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\nconst handler = (0,next_auth_next__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNzQztBQUM0QjtBQUNwQjtBQUNYO0FBRW5DLHlFQUF5RTtBQUNsRSxNQUFNSSxVQUFVLGdCQUFnQjtBQUNoQyxNQUFNQyxVQUFVLFNBQVMsQ0FBQyx3QkFBd0I7QUFFekQsTUFBTUMsU0FBUyxJQUFJSix3REFBWUE7QUF1QnhCLE1BQU1LLGNBQStCO0lBQzFDQyxXQUFXO1FBQ1RQLDJFQUFtQkEsQ0FBQztZQUNsQlEsTUFBTTtZQUNOQyxhQUFhO2dCQUNYQyxPQUFPO29CQUFFQyxPQUFPO29CQUFTQyxNQUFNO2dCQUFRO2dCQUN2Q0MsVUFBVTtvQkFBRUYsT0FBTztvQkFBWUMsTUFBTTtnQkFBVztZQUNsRDtZQUNBLE1BQU1FLFdBQVVMLFdBQVc7Z0JBQ3pCLElBQUksQ0FBQ0EsYUFBYUMsU0FBUyxDQUFDRCxhQUFhSSxVQUFVO29CQUNqRCxPQUFPO2dCQUNUO2dCQUVBLE1BQU1FLE9BQU8sTUFBTVYsT0FBT1UsSUFBSSxDQUFDQyxVQUFVLENBQUM7b0JBQ3hDQyxPQUFPO3dCQUNMUCxPQUFPRCxZQUFZQyxLQUFLO29CQUMxQjtnQkFDRjtnQkFFQSxJQUFJLENBQUNLLE1BQU07b0JBQ1QsT0FBTztnQkFDVDtnQkFFQSxNQUFNRyxrQkFBa0IsTUFBTWhCLDJDQUFnQixDQUM1Q08sWUFBWUksUUFBUSxFQUNwQkUsS0FBS0YsUUFBUTtnQkFHZixJQUFJLENBQUNLLGlCQUFpQjtvQkFDcEIsT0FBTztnQkFDVDtnQkFFQSxPQUFPO29CQUNMRSxJQUFJTCxLQUFLSyxFQUFFO29CQUNYWixNQUFNTyxLQUFLUCxJQUFJO29CQUNmRSxPQUFPSyxLQUFLTCxLQUFLO29CQUNqQlcsTUFBTU4sS0FBS00sSUFBSTtnQkFDakI7WUFDRjtRQUNGO0tBQ0Q7SUFDREMsV0FBVztRQUNULE1BQU1DLEtBQUksRUFBRUMsS0FBSyxFQUFFVCxJQUFJLEVBQUU7WUFDdkIsSUFBSUEsTUFBTTtnQkFDUixPQUFPO29CQUNMLEdBQUdTLEtBQUs7b0JBQ1JKLElBQUlMLEtBQUtLLEVBQUU7b0JBQ1hDLE1BQU1OLEtBQUtNLElBQUk7Z0JBQ2pCO1lBQ0Y7WUFDQSxPQUFPRztRQUNUO1FBQ0EsTUFBTUMsU0FBUSxFQUFFQSxPQUFPLEVBQUVELEtBQUssRUFBRTtZQUM5QixPQUFPO2dCQUNMLEdBQUdDLE9BQU87Z0JBQ1ZWLE1BQU07b0JBQ0osR0FBR1UsUUFBUVYsSUFBSTtvQkFDZkssSUFBSUksTUFBTUosRUFBRTtvQkFDWkMsTUFBTUcsTUFBTUgsSUFBSTtnQkFDbEI7WUFDRjtRQUNGO0lBQ0Y7SUFDQUssT0FBTztRQUNMQyxRQUFRO0lBQ1Y7SUFDQUYsU0FBUztRQUNQRyxVQUFVO0lBQ1o7SUFDQUMsUUFBUUMsUUFBUUMsR0FBRyxDQUFDQyxlQUFlO0FBQ3JDLEVBQUU7QUFFRixNQUFNQyxVQUFVbEMsMERBQVFBLENBQUNPO0FBRWtCIiwic291cmNlcyI6WyJEOlxcUHJvamVjdHNcXG5vcmR2aWtcXG5vcmR2aWtfcGFuZWxcXGFwcFxcYXBpXFxhdXRoXFxbLi4ubmV4dGF1dGhdXFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXV0aE9wdGlvbnMgfSBmcm9tIFwibmV4dC1hdXRoXCI7XG5pbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aC9uZXh0XCI7XG5pbXBvcnQgQ3JlZGVudGlhbHNQcm92aWRlciBmcm9tIFwibmV4dC1hdXRoL3Byb3ZpZGVycy9jcmVkZW50aWFsc1wiO1xuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5pbXBvcnQgKiBhcyBiY3J5cHRqcyBmcm9tIFwiYmNyeXB0XCI7XG5cbi8vIE1hcmsgdGhpcyBmaWxlIGFzIHNlcnZlci1vbmx5IC0gd2lsbCBub3QgYmUgaW5jbHVkZWQgaW4gY2xpZW50IGJ1bmRsZXNcbmV4cG9ydCBjb25zdCBkeW5hbWljID0gJ2ZvcmNlLWR5bmFtaWMnO1xuZXhwb3J0IGNvbnN0IHJ1bnRpbWUgPSAnbm9kZWpzJzsgLy8gRm9yY2UgTm9kZS5qcyBydW50aW1lXG5cbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuLy8gRXh0ZW5kIHRoZSBkZWZhdWx0IHNlc3Npb24gYW5kIHVzZXIgdHlwZXNcbmRlY2xhcmUgbW9kdWxlIFwibmV4dC1hdXRoXCIge1xuICBpbnRlcmZhY2UgU2Vzc2lvbiB7XG4gICAgdXNlcjoge1xuICAgICAgaWQ6IHN0cmluZztcbiAgICAgIG5hbWU/OiBzdHJpbmcgfCBudWxsO1xuICAgICAgZW1haWw/OiBzdHJpbmcgfCBudWxsO1xuICAgICAgaW1hZ2U/OiBzdHJpbmcgfCBudWxsO1xuICAgICAgcm9sZT86IHN0cmluZyB8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgaW50ZXJmYWNlIFVzZXIge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbmFtZT86IHN0cmluZyB8IG51bGw7XG4gICAgZW1haWw/OiBzdHJpbmcgfCBudWxsO1xuICAgIGltYWdlPzogc3RyaW5nIHwgbnVsbDtcbiAgICByb2xlPzogc3RyaW5nIHwgbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ3JlZGVudGlhbHNQcm92aWRlcih7XG4gICAgICBuYW1lOiBcImNyZWRlbnRpYWxzXCIsXG4gICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICBlbWFpbDogeyBsYWJlbDogXCJFbWFpbFwiLCB0eXBlOiBcImVtYWlsXCIgfSxcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6IFwiUGFzc3dvcmRcIiwgdHlwZTogXCJwYXNzd29yZFwiIH0sXG4gICAgICB9LFxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcbiAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgZW1haWw6IGNyZWRlbnRpYWxzLmVtYWlsLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNQYXNzd29yZFZhbGlkID0gYXdhaXQgYmNyeXB0anMuY29tcGFyZShcbiAgICAgICAgICBjcmVkZW50aWFscy5wYXNzd29yZCxcbiAgICAgICAgICB1c2VyLnBhc3N3b3JkXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKCFpc1Bhc3N3b3JkVmFsaWQpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxuICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgIHJvbGU6IHVzZXIucm9sZSBhcyBzdHJpbmcsXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBjYWxsYmFja3M6IHtcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnRva2VuLFxuICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgIHJvbGU6IHVzZXIucm9sZSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zZXNzaW9uLFxuICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgLi4uc2Vzc2lvbi51c2VyLFxuICAgICAgICAgIGlkOiB0b2tlbi5pZCxcbiAgICAgICAgICByb2xlOiB0b2tlbi5yb2xlLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuICBwYWdlczoge1xuICAgIHNpZ25JbjogXCIvbG9naW5cIixcbiAgfSxcbiAgc2Vzc2lvbjoge1xuICAgIHN0cmF0ZWd5OiBcImp3dFwiLFxuICB9LFxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCxcbn07XG5cbmNvbnN0IGhhbmRsZXIgPSBOZXh0QXV0aChhdXRoT3B0aW9ucyk7XG5cbmV4cG9ydCB7IGhhbmRsZXIgYXMgR0VULCBoYW5kbGVyIGFzIFBPU1QgfTtcbiJdLCJuYW1lcyI6WyJOZXh0QXV0aCIsIkNyZWRlbnRpYWxzUHJvdmlkZXIiLCJQcmlzbWFDbGllbnQiLCJiY3J5cHRqcyIsImR5bmFtaWMiLCJydW50aW1lIiwicHJpc21hIiwiYXV0aE9wdGlvbnMiLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlzUGFzc3dvcmRWYWxpZCIsImNvbXBhcmUiLCJpZCIsInJvbGUiLCJjYWxsYmFja3MiLCJqd3QiLCJ0b2tlbiIsInNlc3Npb24iLCJwYWdlcyIsInNpZ25JbiIsInN0cmF0ZWd5Iiwic2VjcmV0IiwicHJvY2VzcyIsImVudiIsIk5FWFRBVVRIX1NFQ1JFVCIsImhhbmRsZXIiLCJHRVQiLCJQT1NUIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./app/api/nodes/route.ts":
/*!********************************!*\
  !*** ./app/api/nodes/route.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _app_api_auth_nextauth_route__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/app/api/auth/[...nextauth]/route */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! uuid */ \"(rsc)/./node_modules/uuid/dist/esm/v4.js\");\n\n\n\n\n\n// GET /api/nodes - Get all nodes\nasync function GET(request) {\n    try {\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_app_api_auth_nextauth_route__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n        if (!session) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Unauthorized\"\n            }, {\n                status: 401\n            });\n        }\n        // Get query parameters\n        const searchParams = request.nextUrl.searchParams;\n        const search = searchParams.get(\"search\") || \"\";\n        const status = searchParams.get(\"status\") || undefined;\n        const os = searchParams.get(\"os\") || undefined;\n        // Build filter conditions\n        const where = {};\n        // If search term is provided, add text search filters\n        if (search) {\n            where.OR = [\n                {\n                    name: {\n                        contains: search\n                    }\n                },\n                {\n                    ipAddress: {\n                        contains: search\n                    }\n                },\n                {\n                    description: {\n                        contains: search\n                    }\n                }\n            ];\n        }\n        if (status) {\n            where.status = status;\n        }\n        if (os) {\n            where.os = os;\n        }\n        // Get all nodes with filtering\n        const nodes = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].node.findMany({\n            where,\n            include: {\n                _count: {\n                    select: {\n                        servers: true\n                    }\n                }\n            },\n            orderBy: {\n                createdAt: \"desc\"\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            nodes\n        });\n    } catch (error) {\n        console.error(\"Error fetching nodes:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to fetch nodes\"\n        }, {\n            status: 500\n        });\n    }\n}\n// POST /api/nodes - Create a new node\nasync function POST(request) {\n    try {\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_app_api_auth_nextauth_route__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n        if (!session) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Unauthorized\"\n            }, {\n                status: 401\n            });\n        }\n        // Check if user is admin\n        const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].user.findUnique({\n            where: {\n                email: session.user?.email\n            }\n        });\n        if (user?.role !== \"ADMIN\") {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Forbidden: Admin access required\"\n            }, {\n                status: 403\n            });\n        }\n        const body = await request.json();\n        // Validate required fields\n        const { name, uid, os, ipAddress, port, username, password } = body;\n        if (!name || !uid || !os || !ipAddress || !port || !username || !password) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Missing required fields\"\n            }, {\n                status: 400\n            });\n        }\n        // Check if node with the same UID already exists\n        const existingNode = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].node.findFirst({\n            where: {\n                uid\n            }\n        });\n        if (existingNode) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"A node with this UID already exists\"\n            }, {\n                status: 400\n            });\n        }\n        // Generate a secure auth token for the node\n        const authToken = (0,uuid__WEBPACK_IMPORTED_MODULE_4__[\"default\"])().replace(/-/g, '') + (0,uuid__WEBPACK_IMPORTED_MODULE_4__[\"default\"])().replace(/-/g, '');\n        // Create the node\n        const node = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].node.create({\n            data: {\n                name,\n                uid,\n                os: os,\n                ipAddress,\n                port,\n                // Add explicit type casting for Prisma to recognize these fields\n                ...username && {\n                    username\n                },\n                ...password && {\n                    password\n                },\n                description: body.description || \"\",\n                status: \"OFFLINE\",\n                authToken\n            }\n        });\n        // Remove password from response for security but include authToken\n        const nodeResponse = {\n            ...node,\n            password: undefined\n        };\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            node: nodeResponse,\n            message: \"Node created successfully\"\n        }, {\n            status: 201\n        });\n    } catch (error) {\n        console.error(\"Error creating node:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to create node\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtRQUN0QyxPQUFPVixxREFBWUEsQ0FBQ1MsSUFBSSxDQUN0QjtZQUFFQyxPQUFPO1FBQXdCLEdBQ2pDO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyJEOlxcUHJvamVjdHNcXG5vcmR2aWtcXG5vcmR2aWtfcGFuZWxcXGFwcFxcYXBpXFxub2Rlc1xccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gXCJuZXh0LWF1dGhcIjtcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSBcIkAvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIjtcbmltcG9ydCBwcmlzbWEgZnJvbSBcIkAvbGliL3ByaXNtYVwiO1xuaW1wb3J0IHsgT3BlcmF0aW5nU3lzdGVtIH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tICd1dWlkJztcblxuLy8gR0VUIC9hcGkvbm9kZXMgLSBHZXQgYWxsIG5vZGVzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuICAgIFxuICAgIGlmICghc2Vzc2lvbikge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiBcIlVuYXV0aG9yaXplZFwiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDEgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBHZXQgcXVlcnkgcGFyYW1ldGVyc1xuICAgIGNvbnN0IHNlYXJjaFBhcmFtcyA9IHJlcXVlc3QubmV4dFVybC5zZWFyY2hQYXJhbXM7XG4gICAgY29uc3Qgc2VhcmNoID0gc2VhcmNoUGFyYW1zLmdldChcInNlYXJjaFwiKSB8fCBcIlwiO1xuICAgIGNvbnN0IHN0YXR1cyA9IHNlYXJjaFBhcmFtcy5nZXQoXCJzdGF0dXNcIikgfHwgdW5kZWZpbmVkO1xuICAgIGNvbnN0IG9zID0gc2VhcmNoUGFyYW1zLmdldChcIm9zXCIpIHx8IHVuZGVmaW5lZDtcbiAgICBcbiAgICAvLyBCdWlsZCBmaWx0ZXIgY29uZGl0aW9uc1xuICAgIGNvbnN0IHdoZXJlOiBhbnkgPSB7fTtcbiAgICBcbiAgICAvLyBJZiBzZWFyY2ggdGVybSBpcyBwcm92aWRlZCwgYWRkIHRleHQgc2VhcmNoIGZpbHRlcnNcbiAgICBpZiAoc2VhcmNoKSB7XG4gICAgICB3aGVyZS5PUiA9IFtcbiAgICAgICAgeyBuYW1lOiB7IGNvbnRhaW5zOiBzZWFyY2ggfSB9LFxuICAgICAgICB7IGlwQWRkcmVzczogeyBjb250YWluczogc2VhcmNoIH0gfSxcbiAgICAgICAgeyBkZXNjcmlwdGlvbjogeyBjb250YWluczogc2VhcmNoIH0gfSxcbiAgICAgIF07XG4gICAgfVxuXG4gICAgaWYgKHN0YXR1cykge1xuICAgICAgd2hlcmUuc3RhdHVzID0gc3RhdHVzO1xuICAgIH1cblxuICAgIGlmIChvcykge1xuICAgICAgd2hlcmUub3MgPSBvcztcbiAgICB9XG5cbiAgICAvLyBHZXQgYWxsIG5vZGVzIHdpdGggZmlsdGVyaW5nXG4gICAgY29uc3Qgbm9kZXMgPSBhd2FpdCBwcmlzbWEubm9kZS5maW5kTWFueSh7XG4gICAgICB3aGVyZSxcbiAgICAgIGluY2x1ZGU6IHtcbiAgICAgICAgX2NvdW50OiB7XG4gICAgICAgICAgc2VsZWN0OiB7IHNlcnZlcnM6IHRydWUgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBvcmRlckJ5OiB7XG4gICAgICAgIGNyZWF0ZWRBdDogXCJkZXNjXCIsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbm9kZXMgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIG5vZGVzOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogXCJGYWlsZWQgdG8gZmV0Y2ggbm9kZXNcIiB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKTtcbiAgfVxufVxuXG4vLyBQT1NUIC9hcGkvbm9kZXMgLSBDcmVhdGUgYSBuZXcgbm9kZVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG4gICAgXG4gICAgaWYgKCFzZXNzaW9uKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMSB9XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHVzZXIgaXMgYWRtaW5cbiAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XG4gICAgICB3aGVyZTogeyBlbWFpbDogc2Vzc2lvbi51c2VyPy5lbWFpbCBhcyBzdHJpbmcgfSxcbiAgICB9KTtcblxuICAgIGlmICh1c2VyPy5yb2xlICE9PSBcIkFETUlOXCIpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJGb3JiaWRkZW46IEFkbWluIGFjY2VzcyByZXF1aXJlZFwiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDMgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG4gICAgXG4gICAgLy8gVmFsaWRhdGUgcmVxdWlyZWQgZmllbGRzXG4gICAgY29uc3QgeyBuYW1lLCB1aWQsIG9zLCBpcEFkZHJlc3MsIHBvcnQsIHVzZXJuYW1lLCBwYXNzd29yZCB9ID0gYm9keTtcbiAgICBcbiAgICBpZiAoIW5hbWUgfHwgIXVpZCB8fCAhb3MgfHwgIWlwQWRkcmVzcyB8fCAhcG9ydCB8fCAhdXNlcm5hbWUgfHwgIXBhc3N3b3JkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiTWlzc2luZyByZXF1aXJlZCBmaWVsZHNcIiB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgbm9kZSB3aXRoIHRoZSBzYW1lIFVJRCBhbHJlYWR5IGV4aXN0c1xuICAgIGNvbnN0IGV4aXN0aW5nTm9kZSA9IGF3YWl0IHByaXNtYS5ub2RlLmZpbmRGaXJzdCh7XG4gICAgICB3aGVyZTogeyB1aWQgfSxcbiAgICB9KTtcblxuICAgIGlmIChleGlzdGluZ05vZGUpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJBIG5vZGUgd2l0aCB0aGlzIFVJRCBhbHJlYWR5IGV4aXN0c1wiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBHZW5lcmF0ZSBhIHNlY3VyZSBhdXRoIHRva2VuIGZvciB0aGUgbm9kZVxuICAgIGNvbnN0IGF1dGhUb2tlbiA9IHV1aWR2NCgpLnJlcGxhY2UoLy0vZywgJycpICsgdXVpZHY0KCkucmVwbGFjZSgvLS9nLCAnJyk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIG5vZGVcbiAgICBjb25zdCBub2RlID0gYXdhaXQgcHJpc21hLm5vZGUuY3JlYXRlKHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdWlkLFxuICAgICAgICBvczogb3MgYXMgT3BlcmF0aW5nU3lzdGVtLFxuICAgICAgICBpcEFkZHJlc3MsXG4gICAgICAgIHBvcnQsXG4gICAgICAgIC8vIEFkZCBleHBsaWNpdCB0eXBlIGNhc3RpbmcgZm9yIFByaXNtYSB0byByZWNvZ25pemUgdGhlc2UgZmllbGRzXG4gICAgICAgIC4uLih1c2VybmFtZSAmJiB7IHVzZXJuYW1lIH0pLFxuICAgICAgICAuLi4ocGFzc3dvcmQgJiYgeyBwYXNzd29yZCB9KSxcbiAgICAgICAgZGVzY3JpcHRpb246IGJvZHkuZGVzY3JpcHRpb24gfHwgXCJcIixcbiAgICAgICAgc3RhdHVzOiBcIk9GRkxJTkVcIiwgLy8gRGVmYXVsdCBzdGF0dXNcbiAgICAgICAgYXV0aFRva2VuLCAvLyBBZGQgdGhlIGdlbmVyYXRlZCBhdXRoIHRva2VuXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gUmVtb3ZlIHBhc3N3b3JkIGZyb20gcmVzcG9uc2UgZm9yIHNlY3VyaXR5IGJ1dCBpbmNsdWRlIGF1dGhUb2tlblxuICAgIGNvbnN0IG5vZGVSZXNwb25zZSA9IHtcbiAgICAgIC4uLm5vZGUsXG4gICAgICBwYXNzd29yZDogdW5kZWZpbmVkXG4gICAgfTtcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgbm9kZTogbm9kZVJlc3BvbnNlLCBtZXNzYWdlOiBcIk5vZGUgY3JlYXRlZCBzdWNjZXNzZnVsbHlcIiB9LFxuICAgICAgeyBzdGF0dXM6IDIwMSB9XG4gICAgKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgY3JlYXRpbmcgbm9kZTpcIiwgZXJyb3IpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6IFwiRmFpbGVkIHRvIGNyZWF0ZSBub2RlXCIgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJnZXRTZXJ2ZXJTZXNzaW9uIiwiYXV0aE9wdGlvbnMiLCJwcmlzbWEiLCJ2NCIsInV1aWR2NCIsIkdFVCIsInJlcXVlc3QiLCJzZXNzaW9uIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwic2VhcmNoUGFyYW1zIiwibmV4dFVybCIsInNlYXJjaCIsImdldCIsInVuZGVmaW5lZCIsIm9zIiwid2hlcmUiLCJPUiIsIm5hbWUiLCJjb250YWlucyIsImlwQWRkcmVzcyIsImRlc2NyaXB0aW9uIiwibm9kZXMiLCJub2RlIiwiZmluZE1hbnkiLCJpbmNsdWRlIiwiX2NvdW50Iiwic2VsZWN0Iiwic2VydmVycyIsIm9yZGVyQnkiLCJjcmVhdGVkQXQiLCJjb25zb2xlIiwiUE9TVCIsInVzZXIiLCJmaW5kVW5pcXVlIiwiZW1haWwiLCJyb2xlIiwiYm9keSIsInVpZCIsInBvcnQiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiZXhpc3RpbmdOb2RlIiwiZmluZEZpcnN0IiwiYXV0aFRva2VuIiwicmVwbGFjZSIsImNyZWF0ZSIsImRhdGEiLCJub2RlUmVzcG9uc2UiLCJtZXNzYWdlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/nodes/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\n// Prevents multiple instances of Prisma Client in development\nconst globalForPrisma = global;\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5Qyw4REFBOEQ7QUFDOUQsTUFBTUMsa0JBQWtCQztBQUV4QixNQUFNQyxTQUFTRixnQkFBZ0JFLE1BQU0sSUFBSSxJQUFJSCx3REFBWUE7QUFFekQsSUFBSUksSUFBcUMsRUFBRUgsZ0JBQWdCRSxNQUFNLEdBQUdBO0FBRXBFLGlFQUFlQSxNQUFNQSxFQUFDIiwic291cmNlcyI6WyJEOlxcUHJvamVjdHNcXG5vcmR2aWtcXG5vcmR2aWtfcGFuZWxcXGxpYlxccHJpc21hLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcblxuLy8gUHJldmVudHMgbXVsdGlwbGUgaW5zdGFuY2VzIG9mIFByaXNtYSBDbGllbnQgaW4gZGV2ZWxvcG1lbnRcbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbCBhcyB1bmtub3duIGFzIHsgcHJpc21hOiBQcmlzbWFDbGllbnQgfTtcblxuY29uc3QgcHJpc21hID0gZ2xvYmFsRm9yUHJpc21hLnByaXNtYSB8fCBuZXcgUHJpc21hQ2xpZW50KCk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hO1xuXG5leHBvcnQgZGVmYXVsdCBwcmlzbWE7XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiZ2xvYmFsRm9yUHJpc21hIiwiZ2xvYmFsIiwicHJpc21hIiwicHJvY2VzcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnodes%2Froute&page=%2Fapi%2Fnodes%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnodes%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnodes%2Froute&page=%2Fapi%2Fnodes%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnodes%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Projects_nordvik_nordvik_panel_app_api_nodes_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/nodes/route.ts */ \"(rsc)/./app/api/nodes/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/nodes/route\",\n        pathname: \"/api/nodes\",\n        filename: \"route\",\n        bundlePath: \"app/api/nodes/route\"\n    },\n    resolvedPagePath: \"D:\\\\Projects\\\\nordvik\\\\nordvik_panel\\\\app\\\\api\\\\nodes\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Projects_nordvik_nordvik_panel_app_api_nodes_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZub2RlcyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGbm9kZXMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZub2RlcyUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDUHJvamVjdHMlNUNub3JkdmlrJTVDbm9yZHZpa19wYW5lbCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9RCUzQSU1Q1Byb2plY3RzJTVDbm9yZHZpayU1Q25vcmR2aWtfcGFuZWwmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ2U7QUFDNUY7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkQ6XFxcXFByb2plY3RzXFxcXG5vcmR2aWtcXFxcbm9yZHZpa19wYW5lbFxcXFxhcHBcXFxcYXBpXFxcXG5vZGVzXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9ub2Rlcy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL25vZGVzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9ub2Rlcy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkQ6XFxcXFByb2plY3RzXFxcXG5vcmR2aWtcXFxcbm9yZHZpa19wYW5lbFxcXFxhcHBcXFxcYXBpXFxcXG5vZGVzXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnodes%2Froute&page=%2Fapi%2Fnodes%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnodes%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

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
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva","vendor-chunks/uuid"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fnodes%2Froute&page=%2Fapi%2Fnodes%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnodes%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();