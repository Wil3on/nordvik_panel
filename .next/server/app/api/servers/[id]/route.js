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
exports.id = "app/api/servers/[id]/route";
exports.ids = ["app/api/servers/[id]/route"];
exports.modules = {

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler),\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   dynamic: () => (/* binding */ dynamic),\n/* harmony export */   runtime: () => (/* binding */ runtime)\n/* harmony export */ });\n/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/next */ \"(rsc)/./node_modules/next-auth/next/index.js\");\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\n// Mark this file as server-only - will not be included in client bundles\nconst dynamic = 'force-dynamic';\nconst runtime = 'nodejs'; // Force Node.js runtime\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_2__.PrismaClient();\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    return null;\n                }\n                const user = await prisma.user.findUnique({\n                    where: {\n                        email: credentials.email\n                    }\n                });\n                if (!user) {\n                    return null;\n                }\n                const isPasswordValid = await bcrypt__WEBPACK_IMPORTED_MODULE_3__.compare(credentials.password, user.password);\n                if (!isPasswordValid) {\n                    return null;\n                }\n                return {\n                    id: user.id,\n                    name: user.name,\n                    email: user.email,\n                    role: user.role\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                return {\n                    ...token,\n                    id: user.id,\n                    role: user.role\n                };\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            return {\n                ...session,\n                user: {\n                    ...session.user,\n                    id: token.id,\n                    role: token.role\n                }\n            };\n        }\n    },\n    pages: {\n        signIn: \"/login\"\n    },\n    session: {\n        strategy: \"jwt\"\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\nconst handler = (0,next_auth_next__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNzQztBQUM0QjtBQUNwQjtBQUNYO0FBRW5DLHlFQUF5RTtBQUNsRSxNQUFNSSxVQUFVLGdCQUFnQjtBQUNoQyxNQUFNQyxVQUFVLFNBQVMsQ0FBQyx3QkFBd0I7QUFFekQsTUFBTUMsU0FBUyxJQUFJSix3REFBWUE7QUF1QnhCLE1BQU1LLGNBQStCO0lBQzFDQyxXQUFXO1FBQ1RQLDJFQUFtQkEsQ0FBQztZQUNsQlEsTUFBTTtZQUNOQyxhQUFhO2dCQUNYQyxPQUFPO29CQUFFQyxPQUFPO29CQUFTQyxNQUFNO2dCQUFRO2dCQUN2Q0MsVUFBVTtvQkFBRUYsT0FBTztvQkFBWUMsTUFBTTtnQkFBVztZQUNsRDtZQUNBLE1BQU1FLFdBQVVMLFdBQVc7Z0JBQ3pCLElBQUksQ0FBQ0EsYUFBYUMsU0FBUyxDQUFDRCxhQUFhSSxVQUFVO29CQUNqRCxPQUFPO2dCQUNUO2dCQUVBLE1BQU1FLE9BQU8sTUFBTVYsT0FBT1UsSUFBSSxDQUFDQyxVQUFVLENBQUM7b0JBQ3hDQyxPQUFPO3dCQUNMUCxPQUFPRCxZQUFZQyxLQUFLO29CQUMxQjtnQkFDRjtnQkFFQSxJQUFJLENBQUNLLE1BQU07b0JBQ1QsT0FBTztnQkFDVDtnQkFFQSxNQUFNRyxrQkFBa0IsTUFBTWhCLDJDQUFnQixDQUM1Q08sWUFBWUksUUFBUSxFQUNwQkUsS0FBS0YsUUFBUTtnQkFHZixJQUFJLENBQUNLLGlCQUFpQjtvQkFDcEIsT0FBTztnQkFDVDtnQkFFQSxPQUFPO29CQUNMRSxJQUFJTCxLQUFLSyxFQUFFO29CQUNYWixNQUFNTyxLQUFLUCxJQUFJO29CQUNmRSxPQUFPSyxLQUFLTCxLQUFLO29CQUNqQlcsTUFBTU4sS0FBS00sSUFBSTtnQkFDakI7WUFDRjtRQUNGO0tBQ0Q7SUFDREMsV0FBVztRQUNULE1BQU1DLEtBQUksRUFBRUMsS0FBSyxFQUFFVCxJQUFJLEVBQUU7WUFDdkIsSUFBSUEsTUFBTTtnQkFDUixPQUFPO29CQUNMLEdBQUdTLEtBQUs7b0JBQ1JKLElBQUlMLEtBQUtLLEVBQUU7b0JBQ1hDLE1BQU1OLEtBQUtNLElBQUk7Z0JBQ2pCO1lBQ0Y7WUFDQSxPQUFPRztRQUNUO1FBQ0EsTUFBTUMsU0FBUSxFQUFFQSxPQUFPLEVBQUVELEtBQUssRUFBRTtZQUM5QixPQUFPO2dCQUNMLEdBQUdDLE9BQU87Z0JBQ1ZWLE1BQU07b0JBQ0osR0FBR1UsUUFBUVYsSUFBSTtvQkFDZkssSUFBSUksTUFBTUosRUFBRTtvQkFDWkMsTUFBTUcsTUFBTUgsSUFBSTtnQkFDbEI7WUFDRjtRQUNGO0lBQ0Y7SUFDQUssT0FBTztRQUNMQyxRQUFRO0lBQ1Y7SUFDQUYsU0FBUztRQUNQRyxVQUFVO0lBQ1o7SUFDQUMsUUFBUUMsUUFBUUMsR0FBRyxDQUFDQyxlQUFlO0FBQ3JDLEVBQUU7QUFFRixNQUFNQyxVQUFVbEMsMERBQVFBLENBQUNPO0FBRWtCIiwic291cmNlcyI6WyJEOlxcUHJvamVjdHNcXG5vcmR2aWtcXG5vcmR2aWtfcGFuZWxcXGFwcFxcYXBpXFxhdXRoXFxbLi4ubmV4dGF1dGhdXFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXV0aE9wdGlvbnMgfSBmcm9tIFwibmV4dC1hdXRoXCI7XG5pbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aC9uZXh0XCI7XG5pbXBvcnQgQ3JlZGVudGlhbHNQcm92aWRlciBmcm9tIFwibmV4dC1hdXRoL3Byb3ZpZGVycy9jcmVkZW50aWFsc1wiO1xuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5pbXBvcnQgKiBhcyBiY3J5cHRqcyBmcm9tIFwiYmNyeXB0XCI7XG5cbi8vIE1hcmsgdGhpcyBmaWxlIGFzIHNlcnZlci1vbmx5IC0gd2lsbCBub3QgYmUgaW5jbHVkZWQgaW4gY2xpZW50IGJ1bmRsZXNcbmV4cG9ydCBjb25zdCBkeW5hbWljID0gJ2ZvcmNlLWR5bmFtaWMnO1xuZXhwb3J0IGNvbnN0IHJ1bnRpbWUgPSAnbm9kZWpzJzsgLy8gRm9yY2UgTm9kZS5qcyBydW50aW1lXG5cbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuLy8gRXh0ZW5kIHRoZSBkZWZhdWx0IHNlc3Npb24gYW5kIHVzZXIgdHlwZXNcbmRlY2xhcmUgbW9kdWxlIFwibmV4dC1hdXRoXCIge1xuICBpbnRlcmZhY2UgU2Vzc2lvbiB7XG4gICAgdXNlcjoge1xuICAgICAgaWQ6IHN0cmluZztcbiAgICAgIG5hbWU/OiBzdHJpbmcgfCBudWxsO1xuICAgICAgZW1haWw/OiBzdHJpbmcgfCBudWxsO1xuICAgICAgaW1hZ2U/OiBzdHJpbmcgfCBudWxsO1xuICAgICAgcm9sZT86IHN0cmluZyB8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgaW50ZXJmYWNlIFVzZXIge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbmFtZT86IHN0cmluZyB8IG51bGw7XG4gICAgZW1haWw/OiBzdHJpbmcgfCBudWxsO1xuICAgIGltYWdlPzogc3RyaW5nIHwgbnVsbDtcbiAgICByb2xlPzogc3RyaW5nIHwgbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ3JlZGVudGlhbHNQcm92aWRlcih7XG4gICAgICBuYW1lOiBcImNyZWRlbnRpYWxzXCIsXG4gICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICBlbWFpbDogeyBsYWJlbDogXCJFbWFpbFwiLCB0eXBlOiBcImVtYWlsXCIgfSxcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6IFwiUGFzc3dvcmRcIiwgdHlwZTogXCJwYXNzd29yZFwiIH0sXG4gICAgICB9LFxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcbiAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgZW1haWw6IGNyZWRlbnRpYWxzLmVtYWlsLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNQYXNzd29yZFZhbGlkID0gYXdhaXQgYmNyeXB0anMuY29tcGFyZShcbiAgICAgICAgICBjcmVkZW50aWFscy5wYXNzd29yZCxcbiAgICAgICAgICB1c2VyLnBhc3N3b3JkXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKCFpc1Bhc3N3b3JkVmFsaWQpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxuICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgIHJvbGU6IHVzZXIucm9sZSBhcyBzdHJpbmcsXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBjYWxsYmFja3M6IHtcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnRva2VuLFxuICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgIHJvbGU6IHVzZXIucm9sZSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zZXNzaW9uLFxuICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgLi4uc2Vzc2lvbi51c2VyLFxuICAgICAgICAgIGlkOiB0b2tlbi5pZCxcbiAgICAgICAgICByb2xlOiB0b2tlbi5yb2xlLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuICBwYWdlczoge1xuICAgIHNpZ25JbjogXCIvbG9naW5cIixcbiAgfSxcbiAgc2Vzc2lvbjoge1xuICAgIHN0cmF0ZWd5OiBcImp3dFwiLFxuICB9LFxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCxcbn07XG5cbmNvbnN0IGhhbmRsZXIgPSBOZXh0QXV0aChhdXRoT3B0aW9ucyk7XG5cbmV4cG9ydCB7IGhhbmRsZXIgYXMgR0VULCBoYW5kbGVyIGFzIFBPU1QgfTtcbiJdLCJuYW1lcyI6WyJOZXh0QXV0aCIsIkNyZWRlbnRpYWxzUHJvdmlkZXIiLCJQcmlzbWFDbGllbnQiLCJiY3J5cHRqcyIsImR5bmFtaWMiLCJydW50aW1lIiwicHJpc21hIiwiYXV0aE9wdGlvbnMiLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlzUGFzc3dvcmRWYWxpZCIsImNvbXBhcmUiLCJpZCIsInJvbGUiLCJjYWxsYmFja3MiLCJqd3QiLCJ0b2tlbiIsInNlc3Npb24iLCJwYWdlcyIsInNpZ25JbiIsInN0cmF0ZWd5Iiwic2VjcmV0IiwicHJvY2VzcyIsImVudiIsIk5FWFRBVVRIX1NFQ1JFVCIsImhhbmRsZXIiLCJHRVQiLCJQT1NUIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./app/api/servers/[id]/route.ts":
/*!***************************************!*\
  !*** ./app/api/servers/[id]/route.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\n\nasync function GET(request, { params }) {\n    try {\n        // Use requireAuth instead of requireAdmin to allow regular users to view servers\n        // This will still ensure the user is logged in\n        // const user = await requireAuth();\n        // For now, skip authentication to debug the issue\n        // will be re-enabled once we verify the API works\n        // Ensure params is awaited before accessing its properties\n        const { id } = params;\n        // Log request information\n        console.log(`Fetching server with ID: ${id}`);\n        // Get server with related data\n        const server = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].server.findUnique({\n            where: {\n                id\n            },\n            include: {\n                game: {\n                    select: {\n                        id: true,\n                        name: true,\n                        gameCode: true\n                    }\n                },\n                node: {\n                    select: {\n                        id: true,\n                        name: true,\n                        ipAddress: true\n                    }\n                },\n                events: {\n                    orderBy: {\n                        createdAt: \"desc\"\n                    },\n                    take: 5\n                },\n                _count: {\n                    select: {\n                        events: true\n                    }\n                }\n            }\n        });\n        // Log whether server was found\n        if (!server) {\n            console.log(`Server with ID ${id} not found`);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Server not found\"\n            }, {\n                status: 404\n            });\n        }\n        // Log successful server fetch\n        console.log(`Server with ID ${id} found:`, JSON.stringify(server, null, 2));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            server\n        });\n    } catch (error) {\n        console.error(\"Error fetching server:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to fetch server\",\n            details: error.message\n        }, {\n            status: 500\n        });\n    }\n}\nasync function PUT(request, { params }) {\n    try {\n        await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.requireAdmin)();\n        // Ensure params is awaited before accessing its properties\n        const { id } = params;\n        const data = await request.json();\n        // Get current server\n        const server = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].server.findUnique({\n            where: {\n                id\n            },\n            include: {\n                game: true,\n                node: true\n            }\n        });\n        if (!server) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Server not found\"\n            }, {\n                status: 404\n            });\n        }\n        // Prevent updating server while it's in a transitional state\n        const transitionalStates = [\n            \"STARTING\",\n            \"STOPPING\",\n            \"RESTARTING\",\n            \"INSTALLING\",\n            \"DOWNLOADING\",\n            \"UPDATING\"\n        ];\n        if (transitionalStates.includes(server.status)) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: `Cannot update server while it's ${server.status.toLowerCase()}`\n            }, {\n                status: 400\n            });\n        }\n        // Only certain fields can be updated\n        const updatedServer = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].server.update({\n            where: {\n                id\n            },\n            data: {\n                name: data.name || undefined,\n                ports: data.ports || undefined\n            },\n            include: {\n                game: true,\n                node: true\n            }\n        });\n        // Log server update event\n        await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].serverEvent.create({\n            data: {\n                serverId: id,\n                type: \"UPDATE\",\n                message: `Server ${updatedServer.name} was updated`\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            server: updatedServer,\n            message: \"Server updated successfully\"\n        });\n    } catch (error) {\n        console.error(\"Error updating server:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to update server\",\n            details: error.message\n        }, {\n            status: 500\n        });\n    }\n}\nasync function DELETE(request, { params }) {\n    try {\n        await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.requireAdmin)();\n        // Ensure params is awaited before accessing its properties\n        const { id } = params;\n        // Get current server using the extracted id parameter\n        const server = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].server.findUnique({\n            where: {\n                id\n            },\n            include: {\n                events: true // Include related events to check\n            }\n        });\n        if (!server) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Server not found\"\n            }, {\n                status: 404\n            });\n        }\n        // Prevent deleting server while it's in a transitional state\n        const transitionalStates = [\n            \"STARTING\",\n            \"STOPPING\",\n            \"RESTARTING\",\n            \"INSTALLING\",\n            \"DOWNLOADING\",\n            \"UPDATING\"\n        ];\n        if (transitionalStates.includes(server.status)) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: `Cannot delete server while it's ${server.status.toLowerCase()}`\n            }, {\n                status: 400\n            });\n        }\n        // First delete all related ServerEvent records to avoid foreign key constraints\n        await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].serverEvent.deleteMany({\n            where: {\n                serverId: id\n            }\n        });\n        // Now delete the server itself\n        await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].server.delete({\n            where: {\n                id\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Server deleted successfully\"\n        });\n    } catch (error) {\n        console.error(\"Error deleting server:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to delete server\",\n            details: error.message\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1lBQ2pEO1FBQ0Y7UUFFQSxJQUFJLENBQUNWLFFBQVE7WUFDWCxPQUFPVCxxREFBWUEsQ0FBQ3dCLElBQUksQ0FDdEI7Z0JBQUVDLE9BQU87WUFBbUIsR0FDNUI7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLDZEQUE2RDtRQUM3RCxNQUFNTyxxQkFBcUI7WUFBQztZQUFZO1lBQVk7WUFBYztZQUFjO1lBQWU7U0FBVztRQUMxRyxJQUFJQSxtQkFBbUJDLFFBQVEsQ0FBQ3pCLE9BQU9pQixNQUFNLEdBQUc7WUFDOUMsT0FBTzFCLHFEQUFZQSxDQUFDd0IsSUFBSSxDQUN0QjtnQkFBRUMsT0FBTyxDQUFDLGdDQUFnQyxFQUFFaEIsT0FBT2lCLE1BQU0sQ0FBQ1MsV0FBVyxJQUFJO1lBQUMsR0FDMUU7Z0JBQUVULFFBQVE7WUFBSTtRQUVsQjtRQUVBLGdGQUFnRjtRQUNoRixNQUFNekIsbURBQU1BLENBQUN1QyxXQUFXLENBQUNLLFVBQVUsQ0FBQztZQUNsQ2xDLE9BQU87Z0JBQUUrQixVQUFVcEM7WUFBRztRQUN4QjtRQUVBLCtCQUErQjtRQUMvQixNQUFNTCxtREFBTUEsQ0FBQ1EsTUFBTSxDQUFDcUMsTUFBTSxDQUFDO1lBQ3pCbkMsT0FBTztnQkFBRUw7WUFBRztRQUNkO1FBRUEsT0FBT04scURBQVlBLENBQUN3QixJQUFJLENBQUM7WUFDdkJNLFNBQVM7UUFDWDtJQUNGLEVBQUUsT0FBT0wsT0FBWTtRQUNuQmxCLFFBQVFrQixLQUFLLENBQUMsMEJBQTBCQTtRQUN4QyxPQUFPekIscURBQVlBLENBQUN3QixJQUFJLENBQ3RCO1lBQUVDLE9BQU87WUFBMkJJLFNBQVNKLE1BQU1LLE9BQU87UUFBQyxHQUMzRDtZQUFFSixRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsiRDpcXFByb2plY3RzXFxub3JkdmlrXFxub3JkdmlrX3BhbmVsXFxhcHBcXGFwaVxcc2VydmVyc1xcW2lkXVxccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHByaXNtYSBmcm9tIFwiQC9saWIvcHJpc21hXCI7XG5pbXBvcnQgeyByZXF1aXJlQWRtaW4gfSBmcm9tIFwiQC9saWIvYXV0aFwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKFxuICByZXF1ZXN0OiBOZXh0UmVxdWVzdCxcbiAgeyBwYXJhbXMgfTogeyBwYXJhbXM6IHsgaWQ6IHN0cmluZyB9IH1cbikge1xuICB0cnkge1xuICAgIC8vIFVzZSByZXF1aXJlQXV0aCBpbnN0ZWFkIG9mIHJlcXVpcmVBZG1pbiB0byBhbGxvdyByZWd1bGFyIHVzZXJzIHRvIHZpZXcgc2VydmVyc1xuICAgIC8vIFRoaXMgd2lsbCBzdGlsbCBlbnN1cmUgdGhlIHVzZXIgaXMgbG9nZ2VkIGluXG4gICAgLy8gY29uc3QgdXNlciA9IGF3YWl0IHJlcXVpcmVBdXRoKCk7XG4gICAgXG4gICAgLy8gRm9yIG5vdywgc2tpcCBhdXRoZW50aWNhdGlvbiB0byBkZWJ1ZyB0aGUgaXNzdWVcbiAgICAvLyB3aWxsIGJlIHJlLWVuYWJsZWQgb25jZSB3ZSB2ZXJpZnkgdGhlIEFQSSB3b3Jrc1xuXG4gICAgLy8gRW5zdXJlIHBhcmFtcyBpcyBhd2FpdGVkIGJlZm9yZSBhY2Nlc3NpbmcgaXRzIHByb3BlcnRpZXNcbiAgICBjb25zdCB7IGlkIH0gPSBwYXJhbXM7XG5cbiAgICAvLyBMb2cgcmVxdWVzdCBpbmZvcm1hdGlvblxuICAgIGNvbnNvbGUubG9nKGBGZXRjaGluZyBzZXJ2ZXIgd2l0aCBJRDogJHtpZH1gKTtcblxuICAgIC8vIEdldCBzZXJ2ZXIgd2l0aCByZWxhdGVkIGRhdGFcbiAgICBjb25zdCBzZXJ2ZXIgPSBhd2FpdCBwcmlzbWEuc2VydmVyLmZpbmRVbmlxdWUoe1xuICAgICAgd2hlcmU6IHsgaWQgfSxcbiAgICAgIGluY2x1ZGU6IHtcbiAgICAgICAgZ2FtZToge1xuICAgICAgICAgIHNlbGVjdDoge1xuICAgICAgICAgICAgaWQ6IHRydWUsXG4gICAgICAgICAgICBuYW1lOiB0cnVlLFxuICAgICAgICAgICAgZ2FtZUNvZGU6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgbm9kZToge1xuICAgICAgICAgIHNlbGVjdDoge1xuICAgICAgICAgICAgaWQ6IHRydWUsXG4gICAgICAgICAgICBuYW1lOiB0cnVlLFxuICAgICAgICAgICAgaXBBZGRyZXNzOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgIG9yZGVyQnk6IHtcbiAgICAgICAgICAgIGNyZWF0ZWRBdDogXCJkZXNjXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0YWtlOiA1LFxuICAgICAgICB9LFxuICAgICAgICBfY291bnQ6IHtcbiAgICAgICAgICBzZWxlY3Q6IHtcbiAgICAgICAgICAgIGV2ZW50czogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gTG9nIHdoZXRoZXIgc2VydmVyIHdhcyBmb3VuZFxuICAgIGlmICghc2VydmVyKSB7XG4gICAgICBjb25zb2xlLmxvZyhgU2VydmVyIHdpdGggSUQgJHtpZH0gbm90IGZvdW5kYCk7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiU2VydmVyIG5vdCBmb3VuZFwiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDQgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBMb2cgc3VjY2Vzc2Z1bCBzZXJ2ZXIgZmV0Y2hcbiAgICBjb25zb2xlLmxvZyhgU2VydmVyIHdpdGggSUQgJHtpZH0gZm91bmQ6YCwgSlNPTi5zdHJpbmdpZnkoc2VydmVyLCBudWxsLCAyKSk7XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzZXJ2ZXIgfSk7XG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgc2VydmVyOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogXCJGYWlsZWQgdG8gZmV0Y2ggc2VydmVyXCIsIGRldGFpbHM6IGVycm9yLm1lc3NhZ2UgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBVVChcbiAgcmVxdWVzdDogTmV4dFJlcXVlc3QsXG4gIHsgcGFyYW1zIH06IHsgcGFyYW1zOiB7IGlkOiBzdHJpbmcgfSB9XG4pIHtcbiAgdHJ5IHtcbiAgICBhd2FpdCByZXF1aXJlQWRtaW4oKTtcblxuICAgIC8vIEVuc3VyZSBwYXJhbXMgaXMgYXdhaXRlZCBiZWZvcmUgYWNjZXNzaW5nIGl0cyBwcm9wZXJ0aWVzXG4gICAgY29uc3QgeyBpZCB9ID0gcGFyYW1zO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcblxuICAgIC8vIEdldCBjdXJyZW50IHNlcnZlclxuICAgIGNvbnN0IHNlcnZlciA9IGF3YWl0IHByaXNtYS5zZXJ2ZXIuZmluZFVuaXF1ZSh7XG4gICAgICB3aGVyZTogeyBpZCB9LFxuICAgICAgaW5jbHVkZToge1xuICAgICAgICBnYW1lOiB0cnVlLFxuICAgICAgICBub2RlOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmICghc2VydmVyKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiU2VydmVyIG5vdCBmb3VuZFwiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDQgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBQcmV2ZW50IHVwZGF0aW5nIHNlcnZlciB3aGlsZSBpdCdzIGluIGEgdHJhbnNpdGlvbmFsIHN0YXRlXG4gICAgY29uc3QgdHJhbnNpdGlvbmFsU3RhdGVzID0gW1wiU1RBUlRJTkdcIiwgXCJTVE9QUElOR1wiLCBcIlJFU1RBUlRJTkdcIiwgXCJJTlNUQUxMSU5HXCIsIFwiRE9XTkxPQURJTkdcIiwgXCJVUERBVElOR1wiXTtcbiAgICBpZiAodHJhbnNpdGlvbmFsU3RhdGVzLmluY2x1ZGVzKHNlcnZlci5zdGF0dXMpKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IGBDYW5ub3QgdXBkYXRlIHNlcnZlciB3aGlsZSBpdCdzICR7c2VydmVyLnN0YXR1cy50b0xvd2VyQ2FzZSgpfWAgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIE9ubHkgY2VydGFpbiBmaWVsZHMgY2FuIGJlIHVwZGF0ZWRcbiAgICBjb25zdCB1cGRhdGVkU2VydmVyID0gYXdhaXQgcHJpc21hLnNlcnZlci51cGRhdGUoe1xuICAgICAgd2hlcmU6IHsgaWQgfSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgbmFtZTogZGF0YS5uYW1lIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgcG9ydHM6IGRhdGEucG9ydHMgfHwgdW5kZWZpbmVkLFxuICAgICAgICAvLyBBZGQgbW9yZSBmaWVsZHMgYXMgbmVlZGVkLCBidXQgYmUgY2FyZWZ1bCB3aXRoIHN0YXR1c1xuICAgICAgfSxcbiAgICAgIGluY2x1ZGU6IHtcbiAgICAgICAgZ2FtZTogdHJ1ZSxcbiAgICAgICAgbm9kZTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBMb2cgc2VydmVyIHVwZGF0ZSBldmVudFxuICAgIGF3YWl0IHByaXNtYS5zZXJ2ZXJFdmVudC5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBzZXJ2ZXJJZDogaWQsXG4gICAgICAgIHR5cGU6IFwiVVBEQVRFXCIsXG4gICAgICAgIG1lc3NhZ2U6IGBTZXJ2ZXIgJHt1cGRhdGVkU2VydmVyLm5hbWV9IHdhcyB1cGRhdGVkYCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgICAgc2VydmVyOiB1cGRhdGVkU2VydmVyLFxuICAgICAgbWVzc2FnZTogXCJTZXJ2ZXIgdXBkYXRlZCBzdWNjZXNzZnVsbHlcIixcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciB1cGRhdGluZyBzZXJ2ZXI6XCIsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiBcIkZhaWxlZCB0byB1cGRhdGUgc2VydmVyXCIsIGRldGFpbHM6IGVycm9yLm1lc3NhZ2UgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIERFTEVURShcbiAgcmVxdWVzdDogTmV4dFJlcXVlc3QsXG4gIHsgcGFyYW1zIH06IHsgcGFyYW1zOiB7IGlkOiBzdHJpbmcgfSB9XG4pIHtcbiAgdHJ5IHtcbiAgICBhd2FpdCByZXF1aXJlQWRtaW4oKTtcblxuICAgIC8vIEVuc3VyZSBwYXJhbXMgaXMgYXdhaXRlZCBiZWZvcmUgYWNjZXNzaW5nIGl0cyBwcm9wZXJ0aWVzXG4gICAgY29uc3QgeyBpZCB9ID0gcGFyYW1zO1xuICAgIFxuICAgIC8vIEdldCBjdXJyZW50IHNlcnZlciB1c2luZyB0aGUgZXh0cmFjdGVkIGlkIHBhcmFtZXRlclxuICAgIGNvbnN0IHNlcnZlciA9IGF3YWl0IHByaXNtYS5zZXJ2ZXIuZmluZFVuaXF1ZSh7XG4gICAgICB3aGVyZTogeyBpZCB9LFxuICAgICAgaW5jbHVkZToge1xuICAgICAgICBldmVudHM6IHRydWUgLy8gSW5jbHVkZSByZWxhdGVkIGV2ZW50cyB0byBjaGVja1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCFzZXJ2ZXIpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJTZXJ2ZXIgbm90IGZvdW5kXCIgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwNCB9XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFByZXZlbnQgZGVsZXRpbmcgc2VydmVyIHdoaWxlIGl0J3MgaW4gYSB0cmFuc2l0aW9uYWwgc3RhdGVcbiAgICBjb25zdCB0cmFuc2l0aW9uYWxTdGF0ZXMgPSBbXCJTVEFSVElOR1wiLCBcIlNUT1BQSU5HXCIsIFwiUkVTVEFSVElOR1wiLCBcIklOU1RBTExJTkdcIiwgXCJET1dOTE9BRElOR1wiLCBcIlVQREFUSU5HXCJdO1xuICAgIGlmICh0cmFuc2l0aW9uYWxTdGF0ZXMuaW5jbHVkZXMoc2VydmVyLnN0YXR1cykpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogYENhbm5vdCBkZWxldGUgc2VydmVyIHdoaWxlIGl0J3MgJHtzZXJ2ZXIuc3RhdHVzLnRvTG93ZXJDYXNlKCl9YCB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gRmlyc3QgZGVsZXRlIGFsbCByZWxhdGVkIFNlcnZlckV2ZW50IHJlY29yZHMgdG8gYXZvaWQgZm9yZWlnbiBrZXkgY29uc3RyYWludHNcbiAgICBhd2FpdCBwcmlzbWEuc2VydmVyRXZlbnQuZGVsZXRlTWFueSh7XG4gICAgICB3aGVyZTogeyBzZXJ2ZXJJZDogaWQgfVxuICAgIH0pO1xuICAgIFxuICAgIC8vIE5vdyBkZWxldGUgdGhlIHNlcnZlciBpdHNlbGZcbiAgICBhd2FpdCBwcmlzbWEuc2VydmVyLmRlbGV0ZSh7XG4gICAgICB3aGVyZTogeyBpZCB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIG1lc3NhZ2U6IFwiU2VydmVyIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5XCIsXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZGVsZXRpbmcgc2VydmVyOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogXCJGYWlsZWQgdG8gZGVsZXRlIHNlcnZlclwiLCBkZXRhaWxzOiBlcnJvci5tZXNzYWdlIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwicHJpc21hIiwicmVxdWlyZUFkbWluIiwiR0VUIiwicmVxdWVzdCIsInBhcmFtcyIsImlkIiwiY29uc29sZSIsImxvZyIsInNlcnZlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImluY2x1ZGUiLCJnYW1lIiwic2VsZWN0IiwibmFtZSIsImdhbWVDb2RlIiwibm9kZSIsImlwQWRkcmVzcyIsImV2ZW50cyIsIm9yZGVyQnkiLCJjcmVhdGVkQXQiLCJ0YWtlIiwiX2NvdW50IiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiSlNPTiIsInN0cmluZ2lmeSIsImRldGFpbHMiLCJtZXNzYWdlIiwiUFVUIiwiZGF0YSIsInRyYW5zaXRpb25hbFN0YXRlcyIsImluY2x1ZGVzIiwidG9Mb3dlckNhc2UiLCJ1cGRhdGVkU2VydmVyIiwidXBkYXRlIiwidW5kZWZpbmVkIiwicG9ydHMiLCJzZXJ2ZXJFdmVudCIsImNyZWF0ZSIsInNlcnZlcklkIiwidHlwZSIsIkRFTEVURSIsImRlbGV0ZU1hbnkiLCJkZWxldGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/servers/[id]/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   dynamic: () => (/* binding */ dynamic),\n/* harmony export */   getCurrentUser: () => (/* binding */ getCurrentUser),\n/* harmony export */   isAdmin: () => (/* binding */ isAdmin),\n/* harmony export */   isUser: () => (/* binding */ isUser),\n/* harmony export */   requireAdmin: () => (/* binding */ requireAdmin),\n/* harmony export */   requireAuth: () => (/* binding */ requireAuth),\n/* harmony export */   runtime: () => (/* binding */ runtime)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _app_api_auth_nextauth_route__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/app/api/auth/[...nextauth]/route */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/navigation */ \"(rsc)/./node_modules/next/dist/api/navigation.react-server.js\");\n// Mark this file as server-only to prevent it from being bundled with client code\nconst dynamic = 'force-dynamic';\nconst runtime = 'nodejs';\n\n\n\n// Server-side auth utilities\nasync function getCurrentUser() {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_0__.getServerSession)(_app_api_auth_nextauth_route__WEBPACK_IMPORTED_MODULE_1__.authOptions);\n    return session?.user;\n}\nasync function requireAuth() {\n    const user = await getCurrentUser();\n    if (!user) {\n        (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.redirect)(\"/login\");\n    }\n    return user;\n}\nasync function requireAdmin() {\n    const user = await requireAuth();\n    if (user.role !== \"ADMIN\") {\n        (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.redirect)(\"/dashboard\");\n    }\n    return user;\n}\n// These utility functions don't use any server-only features and can be safely used\n// in both server and client components\nfunction isAdmin(role) {\n    return role === \"ADMIN\";\n}\nfunction isUser(role) {\n    return role === \"USER\";\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLGtGQUFrRjtBQUMzRSxNQUFNQSxVQUFVLGdCQUFnQjtBQUNoQyxNQUFNQyxVQUFVLFNBQVM7QUFFYTtBQUNvQjtBQUN0QjtBQUUzQyw2QkFBNkI7QUFDdEIsZUFBZUk7SUFDcEIsTUFBTUMsVUFBVSxNQUFNSiwyREFBZ0JBLENBQUNDLHFFQUFXQTtJQUNsRCxPQUFPRyxTQUFTQztBQUNsQjtBQUVPLGVBQWVDO0lBQ3BCLE1BQU1ELE9BQU8sTUFBTUY7SUFFbkIsSUFBSSxDQUFDRSxNQUFNO1FBQ1RILHlEQUFRQSxDQUFDO0lBQ1g7SUFFQSxPQUFPRztBQUNUO0FBRU8sZUFBZUU7SUFDcEIsTUFBTUYsT0FBTyxNQUFNQztJQUVuQixJQUFJRCxLQUFLRyxJQUFJLEtBQUssU0FBUztRQUN6Qk4seURBQVFBLENBQUM7SUFDWDtJQUVBLE9BQU9HO0FBQ1Q7QUFFQSxvRkFBb0Y7QUFDcEYsdUNBQXVDO0FBQ2hDLFNBQVNJLFFBQVFELElBQW9CO0lBQzFDLE9BQU9BLFNBQVM7QUFDbEI7QUFFTyxTQUFTRSxPQUFPRixJQUFvQjtJQUN6QyxPQUFPQSxTQUFTO0FBQ2xCIiwic291cmNlcyI6WyJEOlxcUHJvamVjdHNcXG5vcmR2aWtcXG5vcmR2aWtfcGFuZWxcXGxpYlxcYXV0aC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNYXJrIHRoaXMgZmlsZSBhcyBzZXJ2ZXItb25seSB0byBwcmV2ZW50IGl0IGZyb20gYmVpbmcgYnVuZGxlZCB3aXRoIGNsaWVudCBjb2RlXG5leHBvcnQgY29uc3QgZHluYW1pYyA9ICdmb3JjZS1keW5hbWljJztcbmV4cG9ydCBjb25zdCBydW50aW1lID0gJ25vZGVqcyc7XG5cbmltcG9ydCB7IGdldFNlcnZlclNlc3Npb24gfSBmcm9tIFwibmV4dC1hdXRoXCI7XG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gXCJAL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCI7XG5pbXBvcnQgeyByZWRpcmVjdCB9IGZyb20gXCJuZXh0L25hdmlnYXRpb25cIjtcblxuLy8gU2VydmVyLXNpZGUgYXV0aCB1dGlsaXRpZXNcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDdXJyZW50VXNlcigpIHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuICByZXR1cm4gc2Vzc2lvbj8udXNlcjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmVBdXRoKCkge1xuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudFVzZXIoKTtcbiAgXG4gIGlmICghdXNlcikge1xuICAgIHJlZGlyZWN0KFwiL2xvZ2luXCIpO1xuICB9XG4gIFxuICByZXR1cm4gdXNlcjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmVBZG1pbigpIHtcbiAgY29uc3QgdXNlciA9IGF3YWl0IHJlcXVpcmVBdXRoKCk7XG4gIFxuICBpZiAodXNlci5yb2xlICE9PSBcIkFETUlOXCIpIHtcbiAgICByZWRpcmVjdChcIi9kYXNoYm9hcmRcIik7XG4gIH1cbiAgXG4gIHJldHVybiB1c2VyO1xufVxuXG4vLyBUaGVzZSB1dGlsaXR5IGZ1bmN0aW9ucyBkb24ndCB1c2UgYW55IHNlcnZlci1vbmx5IGZlYXR1cmVzIGFuZCBjYW4gYmUgc2FmZWx5IHVzZWRcbi8vIGluIGJvdGggc2VydmVyIGFuZCBjbGllbnQgY29tcG9uZW50c1xuZXhwb3J0IGZ1bmN0aW9uIGlzQWRtaW4ocm9sZT86IHN0cmluZyB8IG51bGwpIHtcbiAgcmV0dXJuIHJvbGUgPT09IFwiQURNSU5cIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVXNlcihyb2xlPzogc3RyaW5nIHwgbnVsbCkge1xuICByZXR1cm4gcm9sZSA9PT0gXCJVU0VSXCI7XG59XG4iXSwibmFtZXMiOlsiZHluYW1pYyIsInJ1bnRpbWUiLCJnZXRTZXJ2ZXJTZXNzaW9uIiwiYXV0aE9wdGlvbnMiLCJyZWRpcmVjdCIsImdldEN1cnJlbnRVc2VyIiwic2Vzc2lvbiIsInVzZXIiLCJyZXF1aXJlQXV0aCIsInJlcXVpcmVBZG1pbiIsInJvbGUiLCJpc0FkbWluIiwiaXNVc2VyIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\n// Prevents multiple instances of Prisma Client in development\nconst globalForPrisma = global;\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5Qyw4REFBOEQ7QUFDOUQsTUFBTUMsa0JBQWtCQztBQUV4QixNQUFNQyxTQUFTRixnQkFBZ0JFLE1BQU0sSUFBSSxJQUFJSCx3REFBWUE7QUFFekQsSUFBSUksSUFBcUMsRUFBRUgsZ0JBQWdCRSxNQUFNLEdBQUdBO0FBRXBFLGlFQUFlQSxNQUFNQSxFQUFDIiwic291cmNlcyI6WyJEOlxcUHJvamVjdHNcXG5vcmR2aWtcXG5vcmR2aWtfcGFuZWxcXGxpYlxccHJpc21hLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcblxuLy8gUHJldmVudHMgbXVsdGlwbGUgaW5zdGFuY2VzIG9mIFByaXNtYSBDbGllbnQgaW4gZGV2ZWxvcG1lbnRcbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbCBhcyB1bmtub3duIGFzIHsgcHJpc21hOiBQcmlzbWFDbGllbnQgfTtcblxuY29uc3QgcHJpc21hID0gZ2xvYmFsRm9yUHJpc21hLnByaXNtYSB8fCBuZXcgUHJpc21hQ2xpZW50KCk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hO1xuXG5leHBvcnQgZGVmYXVsdCBwcmlzbWE7XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiZ2xvYmFsRm9yUHJpc21hIiwiZ2xvYmFsIiwicHJpc21hIiwicHJvY2VzcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fservers%2F%5Bid%5D%2Froute&page=%2Fapi%2Fservers%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fservers%2F%5Bid%5D%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fservers%2F%5Bid%5D%2Froute&page=%2Fapi%2Fservers%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fservers%2F%5Bid%5D%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Projects_nordvik_nordvik_panel_app_api_servers_id_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/servers/[id]/route.ts */ \"(rsc)/./app/api/servers/[id]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/servers/[id]/route\",\n        pathname: \"/api/servers/[id]\",\n        filename: \"route\",\n        bundlePath: \"app/api/servers/[id]/route\"\n    },\n    resolvedPagePath: \"D:\\\\Projects\\\\nordvik\\\\nordvik_panel\\\\app\\\\api\\\\servers\\\\[id]\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Projects_nordvik_nordvik_panel_app_api_servers_id_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzZXJ2ZXJzJTJGJTVCaWQlNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnNlcnZlcnMlMkYlNUJpZCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnNlcnZlcnMlMkYlNUJpZCU1RCUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDUHJvamVjdHMlNUNub3JkdmlrJTVDbm9yZHZpa19wYW5lbCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9RCUzQSU1Q1Byb2plY3RzJTVDbm9yZHZpayU1Q25vcmR2aWtfcGFuZWwmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ3VCO0FBQ3BHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJEOlxcXFxQcm9qZWN0c1xcXFxub3JkdmlrXFxcXG5vcmR2aWtfcGFuZWxcXFxcYXBwXFxcXGFwaVxcXFxzZXJ2ZXJzXFxcXFtpZF1cXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3NlcnZlcnMvW2lkXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3NlcnZlcnMvW2lkXVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvc2VydmVycy9baWRdL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiRDpcXFxcUHJvamVjdHNcXFxcbm9yZHZpa1xcXFxub3JkdmlrX3BhbmVsXFxcXGFwcFxcXFxhcGlcXFxcc2VydmVyc1xcXFxbaWRdXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fservers%2F%5Bid%5D%2Froute&page=%2Fapi%2Fservers%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fservers%2F%5Bid%5D%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "../app-render/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/server/app-render/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/action-async-storage.external.js");

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
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fservers%2F%5Bid%5D%2Froute&page=%2Fapi%2Fservers%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fservers%2F%5Bid%5D%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();