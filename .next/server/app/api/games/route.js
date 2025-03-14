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
exports.id = "app/api/games/route";
exports.ids = ["app/api/games/route"];
exports.modules = {

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler),\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   dynamic: () => (/* binding */ dynamic),\n/* harmony export */   runtime: () => (/* binding */ runtime)\n/* harmony export */ });\n/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/next */ \"(rsc)/./node_modules/next-auth/next/index.js\");\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\n// Mark this file as server-only - will not be included in client bundles\nconst dynamic = 'force-dynamic';\nconst runtime = 'nodejs'; // Force Node.js runtime\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_2__.PrismaClient();\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    return null;\n                }\n                const user = await prisma.user.findUnique({\n                    where: {\n                        email: credentials.email\n                    }\n                });\n                if (!user) {\n                    return null;\n                }\n                const isPasswordValid = await bcrypt__WEBPACK_IMPORTED_MODULE_3__.compare(credentials.password, user.password);\n                if (!isPasswordValid) {\n                    return null;\n                }\n                return {\n                    id: user.id,\n                    name: user.name,\n                    email: user.email,\n                    role: user.role\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                return {\n                    ...token,\n                    id: user.id,\n                    role: user.role\n                };\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            return {\n                ...session,\n                user: {\n                    ...session.user,\n                    id: token.id,\n                    role: token.role\n                }\n            };\n        }\n    },\n    pages: {\n        signIn: \"/login\"\n    },\n    session: {\n        strategy: \"jwt\"\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\nconst handler = (0,next_auth_next__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNzQztBQUM0QjtBQUNwQjtBQUNYO0FBRW5DLHlFQUF5RTtBQUNsRSxNQUFNSSxVQUFVLGdCQUFnQjtBQUNoQyxNQUFNQyxVQUFVLFNBQVMsQ0FBQyx3QkFBd0I7QUFFekQsTUFBTUMsU0FBUyxJQUFJSix3REFBWUE7QUF1QnhCLE1BQU1LLGNBQStCO0lBQzFDQyxXQUFXO1FBQ1RQLDJFQUFtQkEsQ0FBQztZQUNsQlEsTUFBTTtZQUNOQyxhQUFhO2dCQUNYQyxPQUFPO29CQUFFQyxPQUFPO29CQUFTQyxNQUFNO2dCQUFRO2dCQUN2Q0MsVUFBVTtvQkFBRUYsT0FBTztvQkFBWUMsTUFBTTtnQkFBVztZQUNsRDtZQUNBLE1BQU1FLFdBQVVMLFdBQVc7Z0JBQ3pCLElBQUksQ0FBQ0EsYUFBYUMsU0FBUyxDQUFDRCxhQUFhSSxVQUFVO29CQUNqRCxPQUFPO2dCQUNUO2dCQUVBLE1BQU1FLE9BQU8sTUFBTVYsT0FBT1UsSUFBSSxDQUFDQyxVQUFVLENBQUM7b0JBQ3hDQyxPQUFPO3dCQUNMUCxPQUFPRCxZQUFZQyxLQUFLO29CQUMxQjtnQkFDRjtnQkFFQSxJQUFJLENBQUNLLE1BQU07b0JBQ1QsT0FBTztnQkFDVDtnQkFFQSxNQUFNRyxrQkFBa0IsTUFBTWhCLDJDQUFnQixDQUM1Q08sWUFBWUksUUFBUSxFQUNwQkUsS0FBS0YsUUFBUTtnQkFHZixJQUFJLENBQUNLLGlCQUFpQjtvQkFDcEIsT0FBTztnQkFDVDtnQkFFQSxPQUFPO29CQUNMRSxJQUFJTCxLQUFLSyxFQUFFO29CQUNYWixNQUFNTyxLQUFLUCxJQUFJO29CQUNmRSxPQUFPSyxLQUFLTCxLQUFLO29CQUNqQlcsTUFBTU4sS0FBS00sSUFBSTtnQkFDakI7WUFDRjtRQUNGO0tBQ0Q7SUFDREMsV0FBVztRQUNULE1BQU1DLEtBQUksRUFBRUMsS0FBSyxFQUFFVCxJQUFJLEVBQUU7WUFDdkIsSUFBSUEsTUFBTTtnQkFDUixPQUFPO29CQUNMLEdBQUdTLEtBQUs7b0JBQ1JKLElBQUlMLEtBQUtLLEVBQUU7b0JBQ1hDLE1BQU1OLEtBQUtNLElBQUk7Z0JBQ2pCO1lBQ0Y7WUFDQSxPQUFPRztRQUNUO1FBQ0EsTUFBTUMsU0FBUSxFQUFFQSxPQUFPLEVBQUVELEtBQUssRUFBRTtZQUM5QixPQUFPO2dCQUNMLEdBQUdDLE9BQU87Z0JBQ1ZWLE1BQU07b0JBQ0osR0FBR1UsUUFBUVYsSUFBSTtvQkFDZkssSUFBSUksTUFBTUosRUFBRTtvQkFDWkMsTUFBTUcsTUFBTUgsSUFBSTtnQkFDbEI7WUFDRjtRQUNGO0lBQ0Y7SUFDQUssT0FBTztRQUNMQyxRQUFRO0lBQ1Y7SUFDQUYsU0FBUztRQUNQRyxVQUFVO0lBQ1o7SUFDQUMsUUFBUUMsUUFBUUMsR0FBRyxDQUFDQyxlQUFlO0FBQ3JDLEVBQUU7QUFFRixNQUFNQyxVQUFVbEMsMERBQVFBLENBQUNPO0FBRWtCIiwic291cmNlcyI6WyJEOlxcUHJvamVjdHNcXG5vcmR2aWtcXG5vcmR2aWtfcGFuZWxcXGFwcFxcYXBpXFxhdXRoXFxbLi4ubmV4dGF1dGhdXFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXV0aE9wdGlvbnMgfSBmcm9tIFwibmV4dC1hdXRoXCI7XG5pbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aC9uZXh0XCI7XG5pbXBvcnQgQ3JlZGVudGlhbHNQcm92aWRlciBmcm9tIFwibmV4dC1hdXRoL3Byb3ZpZGVycy9jcmVkZW50aWFsc1wiO1xuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5pbXBvcnQgKiBhcyBiY3J5cHRqcyBmcm9tIFwiYmNyeXB0XCI7XG5cbi8vIE1hcmsgdGhpcyBmaWxlIGFzIHNlcnZlci1vbmx5IC0gd2lsbCBub3QgYmUgaW5jbHVkZWQgaW4gY2xpZW50IGJ1bmRsZXNcbmV4cG9ydCBjb25zdCBkeW5hbWljID0gJ2ZvcmNlLWR5bmFtaWMnO1xuZXhwb3J0IGNvbnN0IHJ1bnRpbWUgPSAnbm9kZWpzJzsgLy8gRm9yY2UgTm9kZS5qcyBydW50aW1lXG5cbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuLy8gRXh0ZW5kIHRoZSBkZWZhdWx0IHNlc3Npb24gYW5kIHVzZXIgdHlwZXNcbmRlY2xhcmUgbW9kdWxlIFwibmV4dC1hdXRoXCIge1xuICBpbnRlcmZhY2UgU2Vzc2lvbiB7XG4gICAgdXNlcjoge1xuICAgICAgaWQ6IHN0cmluZztcbiAgICAgIG5hbWU/OiBzdHJpbmcgfCBudWxsO1xuICAgICAgZW1haWw/OiBzdHJpbmcgfCBudWxsO1xuICAgICAgaW1hZ2U/OiBzdHJpbmcgfCBudWxsO1xuICAgICAgcm9sZT86IHN0cmluZyB8IG51bGw7XG4gICAgfVxuICB9XG5cbiAgaW50ZXJmYWNlIFVzZXIge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbmFtZT86IHN0cmluZyB8IG51bGw7XG4gICAgZW1haWw/OiBzdHJpbmcgfCBudWxsO1xuICAgIGltYWdlPzogc3RyaW5nIHwgbnVsbDtcbiAgICByb2xlPzogc3RyaW5nIHwgbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ3JlZGVudGlhbHNQcm92aWRlcih7XG4gICAgICBuYW1lOiBcImNyZWRlbnRpYWxzXCIsXG4gICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICBlbWFpbDogeyBsYWJlbDogXCJFbWFpbFwiLCB0eXBlOiBcImVtYWlsXCIgfSxcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6IFwiUGFzc3dvcmRcIiwgdHlwZTogXCJwYXNzd29yZFwiIH0sXG4gICAgICB9LFxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcbiAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgZW1haWw6IGNyZWRlbnRpYWxzLmVtYWlsLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNQYXNzd29yZFZhbGlkID0gYXdhaXQgYmNyeXB0anMuY29tcGFyZShcbiAgICAgICAgICBjcmVkZW50aWFscy5wYXNzd29yZCxcbiAgICAgICAgICB1c2VyLnBhc3N3b3JkXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKCFpc1Bhc3N3b3JkVmFsaWQpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxuICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgIHJvbGU6IHVzZXIucm9sZSBhcyBzdHJpbmcsXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBjYWxsYmFja3M6IHtcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnRva2VuLFxuICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgIHJvbGU6IHVzZXIucm9sZSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zZXNzaW9uLFxuICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgLi4uc2Vzc2lvbi51c2VyLFxuICAgICAgICAgIGlkOiB0b2tlbi5pZCxcbiAgICAgICAgICByb2xlOiB0b2tlbi5yb2xlLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuICBwYWdlczoge1xuICAgIHNpZ25JbjogXCIvbG9naW5cIixcbiAgfSxcbiAgc2Vzc2lvbjoge1xuICAgIHN0cmF0ZWd5OiBcImp3dFwiLFxuICB9LFxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCxcbn07XG5cbmNvbnN0IGhhbmRsZXIgPSBOZXh0QXV0aChhdXRoT3B0aW9ucyk7XG5cbmV4cG9ydCB7IGhhbmRsZXIgYXMgR0VULCBoYW5kbGVyIGFzIFBPU1QgfTtcbiJdLCJuYW1lcyI6WyJOZXh0QXV0aCIsIkNyZWRlbnRpYWxzUHJvdmlkZXIiLCJQcmlzbWFDbGllbnQiLCJiY3J5cHRqcyIsImR5bmFtaWMiLCJydW50aW1lIiwicHJpc21hIiwiYXV0aE9wdGlvbnMiLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlzUGFzc3dvcmRWYWxpZCIsImNvbXBhcmUiLCJpZCIsInJvbGUiLCJjYWxsYmFja3MiLCJqd3QiLCJ0b2tlbiIsInNlc3Npb24iLCJwYWdlcyIsInNpZ25JbiIsInN0cmF0ZWd5Iiwic2VjcmV0IiwicHJvY2VzcyIsImVudiIsIk5FWFRBVVRIX1NFQ1JFVCIsImhhbmRsZXIiLCJHRVQiLCJQT1NUIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./app/api/games/route.ts":
/*!********************************!*\
  !*** ./app/api/games/route.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _app_api_auth_nextauth_route__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/app/api/auth/[...nextauth]/route */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\n\n\n// GET handler to fetch all games\nasync function GET(request) {\n    try {\n        // Get query parameters for filtering\n        const searchParams = request.nextUrl.searchParams;\n        const search = searchParams.get(\"search\") || \"\";\n        // Build the query\n        const where = search ? {\n            OR: [\n                {\n                    name: {\n                        contains: search,\n                        mode: \"insensitive\"\n                    }\n                },\n                {\n                    gameCode: {\n                        contains: search,\n                        mode: \"insensitive\"\n                    }\n                },\n                {\n                    steamAppId: {\n                        contains: search,\n                        mode: \"insensitive\"\n                    }\n                }\n            ]\n        } : {};\n        // Fetch games from database\n        const games = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].game.findMany({\n            where,\n            include: {\n                _count: {\n                    select: {\n                        servers: true\n                    }\n                }\n            },\n            orderBy: {\n                name: \"asc\"\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            games\n        });\n    } catch (error) {\n        console.error(\"Error fetching games:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to fetch games\"\n        }, {\n            status: 500\n        });\n    }\n}\n// POST handler to create a new game\nasync function POST(request) {\n    try {\n        // Check if user is authenticated and has admin role\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_app_api_auth_nextauth_route__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n        if (!session || session.user?.role !== \"ADMIN\") {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Forbidden: Admin privileges required\"\n            }, {\n                status: 403\n            });\n        }\n        // Parse request body\n        const body = await request.json();\n        // Log the request data for debugging\n        console.log(\"Received game data:\", JSON.stringify(body));\n        // Validate required fields\n        if (!body.name || !body.gameCode || !body.description) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Missing required fields\"\n            }, {\n                status: 400\n            });\n        }\n        // Check if game with the same code already exists\n        const existingGame = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].game.findUnique({\n            where: {\n                gameCode: body.gameCode\n            }\n        });\n        if (existingGame) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"A game with this code already exists\"\n            }, {\n                status: 400\n            });\n        }\n        // Create the game in the database\n        try {\n            // Ensure that JSON fields are properly formatted\n            let supportedOS = {\n                windows: true,\n                linux: false\n            };\n            let defaultConfig = {};\n            // Validate supportedOS format\n            if (body.supportedOS) {\n                if (typeof body.supportedOS === 'string') {\n                    try {\n                        supportedOS = JSON.parse(body.supportedOS);\n                    } catch (e) {\n                        console.error(\"Invalid supportedOS JSON:\", e);\n                    }\n                } else {\n                    supportedOS = body.supportedOS;\n                }\n            }\n            // Validate defaultConfig format\n            if (body.defaultConfig) {\n                if (typeof body.defaultConfig === 'string') {\n                    try {\n                        defaultConfig = JSON.parse(body.defaultConfig);\n                    } catch (e) {\n                        console.error(\"Invalid defaultConfig JSON:\", e);\n                    }\n                } else {\n                    defaultConfig = body.defaultConfig;\n                }\n            }\n            console.log(\"Creating game with data:\", {\n                name: body.name,\n                gameCode: body.gameCode,\n                steamAppId: body.steamAppId || null,\n                description: body.description,\n                supportedOS: supportedOS,\n                startupCommands: body.startupCommands || null,\n                defaultConfig: defaultConfig\n            });\n            const game = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].game.create({\n                data: {\n                    name: body.name,\n                    gameCode: body.gameCode,\n                    steamAppId: body.steamAppId || null,\n                    description: body.description,\n                    supportedOS: supportedOS,\n                    startupCommands: body.startupCommands || null,\n                    defaultConfig: defaultConfig\n                }\n            });\n            // Log activity is removed since the ActivityLog model doesn't exist in the schema\n            // Send notification to admins\n            if (typeof sendNotification !== 'undefined') {\n                sendNotification({\n                    title: \"New Game Added\",\n                    message: `${game.name} has been added to the game library`,\n                    type: \"info\",\n                    role: \"admin\"\n                });\n            }\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                game\n            }, {\n                status: 201\n            });\n        } catch (dbError) {\n            console.error(\"Database error creating game:\", dbError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Failed to create game in database\",\n                details: dbError.message\n            }, {\n                status: 500\n            });\n        }\n    } catch (error) {\n        console.error(\"Error creating game:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to create game\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LGlCQUFpQjtvQkFDZkMsT0FBTztvQkFDUEMsU0FBUyxHQUFHakMsS0FBS04sSUFBSSxDQUFDLG1DQUFtQyxDQUFDO29CQUMxRHdDLE1BQU07b0JBQ05wQixNQUFNO2dCQUNSO1lBQ0Y7WUFFQSxPQUFPaEMscURBQVlBLENBQUN5QixJQUFJLENBQUM7Z0JBQUVQO1lBQUssR0FBRztnQkFBRVUsUUFBUTtZQUFJO1FBQ25ELEVBQUUsT0FBT3lCLFNBQWM7WUFDckIxQixRQUFRRCxLQUFLLENBQUMsaUNBQWlDMkI7WUFDL0MsT0FBT3JELHFEQUFZQSxDQUFDeUIsSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztnQkFBcUM0QixTQUFTRCxRQUFRRixPQUFPO1lBQUMsR0FDdkU7Z0JBQUV2QixRQUFRO1lBQUk7UUFFbEI7SUFDRixFQUFFLE9BQU9GLE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLHdCQUF3QkE7UUFDdEMsT0FBTzFCLHFEQUFZQSxDQUFDeUIsSUFBSSxDQUN0QjtZQUFFQyxPQUFPO1FBQXdCLEdBQ2pDO1lBQUVFLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyJEOlxcUHJvamVjdHNcXG5vcmR2aWtcXG5vcmR2aWtfcGFuZWxcXGFwcFxcYXBpXFxnYW1lc1xccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gXCJuZXh0LWF1dGhcIjtcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSBcIkAvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIjtcbmltcG9ydCBwcmlzbWEgZnJvbSBcIkAvbGliL3ByaXNtYVwiO1xuXG4vLyBHRVQgaGFuZGxlciB0byBmZXRjaCBhbGwgZ2FtZXNcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICAvLyBHZXQgcXVlcnkgcGFyYW1ldGVycyBmb3IgZmlsdGVyaW5nXG4gICAgY29uc3Qgc2VhcmNoUGFyYW1zID0gcmVxdWVzdC5uZXh0VXJsLnNlYXJjaFBhcmFtcztcbiAgICBjb25zdCBzZWFyY2ggPSBzZWFyY2hQYXJhbXMuZ2V0KFwic2VhcmNoXCIpIHx8IFwiXCI7XG4gICAgXG4gICAgLy8gQnVpbGQgdGhlIHF1ZXJ5XG4gICAgY29uc3Qgd2hlcmUgPSBzZWFyY2hcbiAgICAgID8ge1xuICAgICAgICAgIE9SOiBbXG4gICAgICAgICAgICB7IG5hbWU6IHsgY29udGFpbnM6IHNlYXJjaCwgbW9kZTogXCJpbnNlbnNpdGl2ZVwiIH0gfSxcbiAgICAgICAgICAgIHsgZ2FtZUNvZGU6IHsgY29udGFpbnM6IHNlYXJjaCwgbW9kZTogXCJpbnNlbnNpdGl2ZVwiIH0gfSxcbiAgICAgICAgICAgIHsgc3RlYW1BcHBJZDogeyBjb250YWluczogc2VhcmNoLCBtb2RlOiBcImluc2Vuc2l0aXZlXCIgfSB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH1cbiAgICAgIDoge307XG4gICAgXG4gICAgLy8gRmV0Y2ggZ2FtZXMgZnJvbSBkYXRhYmFzZVxuICAgIGNvbnN0IGdhbWVzID0gYXdhaXQgcHJpc21hLmdhbWUuZmluZE1hbnkoe1xuICAgICAgd2hlcmUsXG4gICAgICBpbmNsdWRlOiB7XG4gICAgICAgIF9jb3VudDoge1xuICAgICAgICAgIHNlbGVjdDogeyBzZXJ2ZXJzOiB0cnVlIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgb3JkZXJCeToge1xuICAgICAgICBuYW1lOiBcImFzY1wiLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBnYW1lcyB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgZ2FtZXM6XCIsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiBcIkZhaWxlZCB0byBmZXRjaCBnYW1lc1wiIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59XG5cbi8vIFBPU1QgaGFuZGxlciB0byBjcmVhdGUgYSBuZXcgZ2FtZVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICAvLyBDaGVjayBpZiB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQgYW5kIGhhcyBhZG1pbiByb2xlXG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuICAgIFxuICAgIGlmICghc2Vzc2lvbiB8fCBzZXNzaW9uLnVzZXI/LnJvbGUgIT09IFwiQURNSU5cIikge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiBcIkZvcmJpZGRlbjogQWRtaW4gcHJpdmlsZWdlcyByZXF1aXJlZFwiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDMgfVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gUGFyc2UgcmVxdWVzdCBib2R5XG4gICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuICAgIFxuICAgIC8vIExvZyB0aGUgcmVxdWVzdCBkYXRhIGZvciBkZWJ1Z2dpbmdcbiAgICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkIGdhbWUgZGF0YTpcIiwgSlNPTi5zdHJpbmdpZnkoYm9keSkpO1xuICAgIFxuICAgIC8vIFZhbGlkYXRlIHJlcXVpcmVkIGZpZWxkc1xuICAgIGlmICghYm9keS5uYW1lIHx8ICFib2R5LmdhbWVDb2RlIHx8ICFib2R5LmRlc2NyaXB0aW9uKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiTWlzc2luZyByZXF1aXJlZCBmaWVsZHNcIiB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIC8vIENoZWNrIGlmIGdhbWUgd2l0aCB0aGUgc2FtZSBjb2RlIGFscmVhZHkgZXhpc3RzXG4gICAgY29uc3QgZXhpc3RpbmdHYW1lID0gYXdhaXQgcHJpc21hLmdhbWUuZmluZFVuaXF1ZSh7XG4gICAgICB3aGVyZTogeyBnYW1lQ29kZTogYm9keS5nYW1lQ29kZSB9LFxuICAgIH0pO1xuICAgIFxuICAgIGlmIChleGlzdGluZ0dhbWUpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJBIGdhbWUgd2l0aCB0aGlzIGNvZGUgYWxyZWFkeSBleGlzdHNcIiB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIC8vIENyZWF0ZSB0aGUgZ2FtZSBpbiB0aGUgZGF0YWJhc2VcbiAgICB0cnkge1xuICAgICAgLy8gRW5zdXJlIHRoYXQgSlNPTiBmaWVsZHMgYXJlIHByb3Blcmx5IGZvcm1hdHRlZFxuICAgICAgbGV0IHN1cHBvcnRlZE9TID0geyB3aW5kb3dzOiB0cnVlLCBsaW51eDogZmFsc2UgfTtcbiAgICAgIGxldCBkZWZhdWx0Q29uZmlnID0ge307XG4gICAgICBcbiAgICAgIC8vIFZhbGlkYXRlIHN1cHBvcnRlZE9TIGZvcm1hdFxuICAgICAgaWYgKGJvZHkuc3VwcG9ydGVkT1MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBib2R5LnN1cHBvcnRlZE9TID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzdXBwb3J0ZWRPUyA9IEpTT04ucGFyc2UoYm9keS5zdXBwb3J0ZWRPUyk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgc3VwcG9ydGVkT1MgSlNPTjpcIiwgZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1cHBvcnRlZE9TID0gYm9keS5zdXBwb3J0ZWRPUztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBWYWxpZGF0ZSBkZWZhdWx0Q29uZmlnIGZvcm1hdFxuICAgICAgaWYgKGJvZHkuZGVmYXVsdENvbmZpZykge1xuICAgICAgICBpZiAodHlwZW9mIGJvZHkuZGVmYXVsdENvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGVmYXVsdENvbmZpZyA9IEpTT04ucGFyc2UoYm9keS5kZWZhdWx0Q29uZmlnKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBkZWZhdWx0Q29uZmlnIEpTT046XCIsIGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWZhdWx0Q29uZmlnID0gYm9keS5kZWZhdWx0Q29uZmlnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgZ2FtZSB3aXRoIGRhdGE6XCIsIHtcbiAgICAgICAgbmFtZTogYm9keS5uYW1lLFxuICAgICAgICBnYW1lQ29kZTogYm9keS5nYW1lQ29kZSxcbiAgICAgICAgc3RlYW1BcHBJZDogYm9keS5zdGVhbUFwcElkIHx8IG51bGwsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBib2R5LmRlc2NyaXB0aW9uLFxuICAgICAgICBzdXBwb3J0ZWRPUzogc3VwcG9ydGVkT1MsXG4gICAgICAgIHN0YXJ0dXBDb21tYW5kczogYm9keS5zdGFydHVwQ29tbWFuZHMgfHwgbnVsbCxcbiAgICAgICAgZGVmYXVsdENvbmZpZzogZGVmYXVsdENvbmZpZyxcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBjb25zdCBnYW1lID0gYXdhaXQgcHJpc21hLmdhbWUuY3JlYXRlKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG5hbWU6IGJvZHkubmFtZSxcbiAgICAgICAgICBnYW1lQ29kZTogYm9keS5nYW1lQ29kZSxcbiAgICAgICAgICBzdGVhbUFwcElkOiBib2R5LnN0ZWFtQXBwSWQgfHwgbnVsbCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogYm9keS5kZXNjcmlwdGlvbixcbiAgICAgICAgICBzdXBwb3J0ZWRPUzogc3VwcG9ydGVkT1MsXG4gICAgICAgICAgc3RhcnR1cENvbW1hbmRzOiBib2R5LnN0YXJ0dXBDb21tYW5kcyB8fCBudWxsLFxuICAgICAgICAgIGRlZmF1bHRDb25maWc6IGRlZmF1bHRDb25maWcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgLy8gTG9nIGFjdGl2aXR5IGlzIHJlbW92ZWQgc2luY2UgdGhlIEFjdGl2aXR5TG9nIG1vZGVsIGRvZXNuJ3QgZXhpc3QgaW4gdGhlIHNjaGVtYVxuICAgICAgXG4gICAgICAvLyBTZW5kIG5vdGlmaWNhdGlvbiB0byBhZG1pbnNcbiAgICAgIGlmICh0eXBlb2Ygc2VuZE5vdGlmaWNhdGlvbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgc2VuZE5vdGlmaWNhdGlvbih7XG4gICAgICAgICAgdGl0bGU6IFwiTmV3IEdhbWUgQWRkZWRcIixcbiAgICAgICAgICBtZXNzYWdlOiBgJHtnYW1lLm5hbWV9IGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBnYW1lIGxpYnJhcnlgLFxuICAgICAgICAgIHR5cGU6IFwiaW5mb1wiLFxuICAgICAgICAgIHJvbGU6IFwiYWRtaW5cIixcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGdhbWUgfSwgeyBzdGF0dXM6IDIwMSB9KTtcbiAgICB9IGNhdGNoIChkYkVycm9yOiBhbnkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJEYXRhYmFzZSBlcnJvciBjcmVhdGluZyBnYW1lOlwiLCBkYkVycm9yKTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJGYWlsZWQgdG8gY3JlYXRlIGdhbWUgaW4gZGF0YWJhc2VcIiwgZGV0YWlsczogZGJFcnJvci5tZXNzYWdlIH0sXG4gICAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICAgKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGNyZWF0aW5nIGdhbWU6XCIsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiBcIkZhaWxlZCB0byBjcmVhdGUgZ2FtZVwiIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0U2VydmVyU2Vzc2lvbiIsImF1dGhPcHRpb25zIiwicHJpc21hIiwiR0VUIiwicmVxdWVzdCIsInNlYXJjaFBhcmFtcyIsIm5leHRVcmwiLCJzZWFyY2giLCJnZXQiLCJ3aGVyZSIsIk9SIiwibmFtZSIsImNvbnRhaW5zIiwibW9kZSIsImdhbWVDb2RlIiwic3RlYW1BcHBJZCIsImdhbWVzIiwiZ2FtZSIsImZpbmRNYW55IiwiaW5jbHVkZSIsIl9jb3VudCIsInNlbGVjdCIsInNlcnZlcnMiLCJvcmRlckJ5IiwianNvbiIsImVycm9yIiwiY29uc29sZSIsInN0YXR1cyIsIlBPU1QiLCJzZXNzaW9uIiwidXNlciIsInJvbGUiLCJib2R5IiwibG9nIiwiSlNPTiIsInN0cmluZ2lmeSIsImRlc2NyaXB0aW9uIiwiZXhpc3RpbmdHYW1lIiwiZmluZFVuaXF1ZSIsInN1cHBvcnRlZE9TIiwid2luZG93cyIsImxpbnV4IiwiZGVmYXVsdENvbmZpZyIsInBhcnNlIiwiZSIsInN0YXJ0dXBDb21tYW5kcyIsImNyZWF0ZSIsImRhdGEiLCJzZW5kTm90aWZpY2F0aW9uIiwidGl0bGUiLCJtZXNzYWdlIiwidHlwZSIsImRiRXJyb3IiLCJkZXRhaWxzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/games/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\n// Prevents multiple instances of Prisma Client in development\nconst globalForPrisma = global;\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5Qyw4REFBOEQ7QUFDOUQsTUFBTUMsa0JBQWtCQztBQUV4QixNQUFNQyxTQUFTRixnQkFBZ0JFLE1BQU0sSUFBSSxJQUFJSCx3REFBWUE7QUFFekQsSUFBSUksSUFBcUMsRUFBRUgsZ0JBQWdCRSxNQUFNLEdBQUdBO0FBRXBFLGlFQUFlQSxNQUFNQSxFQUFDIiwic291cmNlcyI6WyJEOlxcUHJvamVjdHNcXG5vcmR2aWtcXG5vcmR2aWtfcGFuZWxcXGxpYlxccHJpc21hLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcblxuLy8gUHJldmVudHMgbXVsdGlwbGUgaW5zdGFuY2VzIG9mIFByaXNtYSBDbGllbnQgaW4gZGV2ZWxvcG1lbnRcbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbCBhcyB1bmtub3duIGFzIHsgcHJpc21hOiBQcmlzbWFDbGllbnQgfTtcblxuY29uc3QgcHJpc21hID0gZ2xvYmFsRm9yUHJpc21hLnByaXNtYSB8fCBuZXcgUHJpc21hQ2xpZW50KCk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hO1xuXG5leHBvcnQgZGVmYXVsdCBwcmlzbWE7XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiZ2xvYmFsRm9yUHJpc21hIiwiZ2xvYmFsIiwicHJpc21hIiwicHJvY2VzcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgames%2Froute&page=%2Fapi%2Fgames%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgames%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgames%2Froute&page=%2Fapi%2Fgames%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgames%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Projects_nordvik_nordvik_panel_app_api_games_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/games/route.ts */ \"(rsc)/./app/api/games/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/games/route\",\n        pathname: \"/api/games\",\n        filename: \"route\",\n        bundlePath: \"app/api/games/route\"\n    },\n    resolvedPagePath: \"D:\\\\Projects\\\\nordvik\\\\nordvik_panel\\\\app\\\\api\\\\games\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Projects_nordvik_nordvik_panel_app_api_games_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZnYW1lcyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGZ2FtZXMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZnYW1lcyUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDUHJvamVjdHMlNUNub3JkdmlrJTVDbm9yZHZpa19wYW5lbCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9RCUzQSU1Q1Byb2plY3RzJTVDbm9yZHZpayU1Q25vcmR2aWtfcGFuZWwmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ2U7QUFDNUY7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkQ6XFxcXFByb2plY3RzXFxcXG5vcmR2aWtcXFxcbm9yZHZpa19wYW5lbFxcXFxhcHBcXFxcYXBpXFxcXGdhbWVzXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9nYW1lcy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2dhbWVzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9nYW1lcy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkQ6XFxcXFByb2plY3RzXFxcXG5vcmR2aWtcXFxcbm9yZHZpa19wYW5lbFxcXFxhcHBcXFxcYXBpXFxcXGdhbWVzXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgames%2Froute&page=%2Fapi%2Fgames%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgames%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fgames%2Froute&page=%2Fapi%2Fgames%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgames%2Froute.ts&appDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CProjects%5Cnordvik%5Cnordvik_panel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();