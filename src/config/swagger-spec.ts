import { env } from "@/config/env";

export const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "Interview Management API",
        version: "1.0.0",
        description: "A RESTful API for the Robinhood technical assessment.",
    },
    servers: [{ url: `${env.APP_URL}` }],
    paths: {
        "/api/v1/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Log in an existing user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Login" },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Authentication successful.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: { token: { type: "string" } },
                                },
                            },
                        },
                    },
                    "401": { description: "Invalid email or password." },
                },
            },
        },
        "/api/v1/interviews": {
            get: {
                tags: ["Interview"],
                summary: "Retrieve a paginated list of all interviews",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "query",
                        name: "page",
                        schema: { type: "integer", default: 1, minimum: 1 },
                        description: "The page number to retrieve.",
                    },
                    {
                        in: "query",
                        name: "limit",
                        schema: { type: "integer", default: 10, minimum: 1, maximum: 100 },
                        description: "The number of items to return per page.",
                    },
                ],
                responses: {
                    "200": {
                        description: "A paginated list of interviews.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "array",
                                            items: { $ref: "#/components/schemas/Interview" },
                                        },
                                        meta: {
                                            type: "object",
                                            properties: {
                                                totalItems: { type: "integer" },
                                                itemCount: { type: "integer" },
                                                itemsPerPage: { type: "integer" },
                                                totalPages: { type: "integer" },
                                                currentPage: { type: "integer" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["Interview"],
                summary: "Create a new interview",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateInterview" },
                        },
                    },
                },
                responses: {
                    "201": { description: "Interview created successfully." },
                },
            },
        },
        "/api/v1/interviews/{id}": {
            get: {
                tags: ['Interview'],
                summary: 'Get an interview by its ID',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: {
                    '200': {
                        description: 'Interview details, including user, comments and histories.',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/InterviewDetails' } } },
                    },
                    '404': { description: 'Interview not found.' },
                },
            },
            patch: {
                tags: ["Interview"],
                summary: "Update an existing interview",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateInterview" },
                        },
                    },
                },
                responses: {
                    "200": { description: "Interview updated successfully." },
                },
            },
            delete: {
                tags: ["Interview"],
                summary: "Delete an interview",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "204": { description: "Interview deleted successfully." },
                },
            },
        },
        '/api/v1/interviews/{id}/save': {
            patch: {
                tags: ['Interview'],
                summary: 'Save (archive) an interview',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Interview saved successfully.' } },
            },
        },
        "/api/v1/interviews/{interviewId}/comments": {
            get: {
                tags: ["Interview Comment"],
                summary: "Get all comments for a specific interview",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "interviewId",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description: "A list of comments.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/InterviewComment" },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["Interview Comment"],
                summary: "Create a new comment on an interview",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "interviewId",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateInterviewComment" },
                        },
                    },
                },
                responses: { "201": { description: "Comment created successfully." } },
            },
        },
        "/api/v1/interviews/{interviewId}/comments/{commentId}": {
            patch: {
                tags: ["Interview Comment"],
                summary: "Update a comment",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "interviewId",
                        required: true,
                        schema: { type: "string" },
                    },
                    {
                        in: "path",
                        name: "commentId",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateInterviewComment" },
                        },
                    },
                },
                responses: { "200": { description: "Comment updated successfully." } },
            },
            delete: {
                tags: ["Interview Comment"],
                summary: "Delete a comment",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "interviewId",
                        required: true,
                        schema: { type: "string" },
                    },
                    {
                        in: "path",
                        name: "commentId",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "204": { description: "Comment deleted successfully." } },
            },
        },
        '/api/v1/interviews/{interviewId}/histories': {
            get: {
                tags: ['Interview History'],
                summary: 'Get the audit history for a specific interview',
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'interviewId', required: true, schema: { type: 'string' } }],
                responses: {
                    '200': {
                        description: 'A list of history records for the interview.',
                        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/InterviewHistory' } } } },
                    },
                },
            },
        },
        "/api/v1/users": {
            get: {
                tags: ["User Management"],
                summary: "(Admin Only) Retrieve a list of all users",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "A list of users.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/User" },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/v1/users/{id}": {
            get: {
                tags: ["User Management"],
                summary: "(Admin Only) Get a single user by ID",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "200": { description: "User details." } },
            },
        },
        "/api/v1/users/{id}/roles": {
            patch: {
                tags: ["User Management"],
                summary: "(Admin Only) Update a user's roles",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateUserRoles" },
                        },
                    },
                },
                responses: {
                    "200": { description: "User roles updated successfully." },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
        schemas: {
            Register: { type: 'object', properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password', minLength: 6 } }, required: ['email', 'password'] },
            Login: { type: 'object', properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } }, required: ['email', 'password'] },
            Role: { type: 'object', properties: { key: { type: 'string' }, name: { type: 'string' } } },
            User: { type: 'object', properties: { id: { type: 'string' }, key: { type: 'string' }, email: { type: 'string' }, createdAt: { type: 'string', format: 'date-time' }, roles: { type: 'array', items: { $ref: '#/components/schemas/Role' } } } },
            UpdateUserRoles: { type: 'object', properties: { roles: { type: 'array', items: { type: 'string', example: 'interviewer' } } }, required: ['roles'] },
            Interview: { type: 'object', properties: { id: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'] }, isSaved: { type: 'boolean' }, userId: { type: 'string' }, createdAt: { type: 'string', format: 'date-time' }, updatedAt: { type: 'string', format: 'date-time' } } },
            CreateInterview: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' } }, required: ['title'] },
            UpdateInterview: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'] }, isSaved: { type: 'boolean' } } },
            InterviewComment: { type: 'object', properties: { id: { type: 'string' }, content: { type: 'string' }, userId: { type: 'string' }, interviewId: { type: 'string' }, createdAt: { type: 'string', format: 'date-time' } } },
            CreateInterviewComment: { type: 'object', properties: { content: { type: 'string' } }, required: ['content'] },
            UpdateInterviewComment: { type: 'object', properties: { content: { type: 'string' } }, required: ['content'] },
            InterviewHistory: { type: 'object', properties: { id: { type: 'string' }, action: { type: 'string' }, oldValue: { type: 'string' }, newValue: { type: 'string' }, userId: { type: 'string' }, interviewId: { type: 'string' }, changedAt: { type: 'string', format: 'date-time' } } },
            InterviewDetails: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'] },
                    isSaved: { type: 'boolean' },
                    userId: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    user: { type: 'object', properties: { id: { type: 'string' }, email: { type: 'string' } } },
                    comments: { type: 'array', items: { $ref: '#/components/schemas/InterviewComment' } },
                    histories: { type: 'array', items: { $ref: '#/components/schemas/InterviewHistory' } },
                },
            },
        },
    },
};
