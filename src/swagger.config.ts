import "dotenv/config";

export const swaggerDocument = {
    openapi: '3.0.2',
    info: {
        version: '1.0.1',
        title: 'API for chat-webserver',
        description: 'This project allows users to share opinions about different interests in chat-room',
        contact: {
            name: 'Serdar Durdyev',
            email: 'sedgarthr@gmail.com',
        },
    },
    host: `http://localhost:${process.env.PORT}`,
    tags: [
        {
            name: 'room',
            description: 'Methods for rooms API'
        },
        {
            name: "interest",
            description: "Methods for interests API"
        }
    ],
    paths: {
        "/api/interest/": {
            get: {
                summary: "Get all interests in our website",
                description: "Method returns list of all interests in our website",
                tags: ["interest"],
                produces: [
                    "application/json"
                ],
                responses: {
                    200: {
                        description: "List of available interests"
                    }
                }
            }
        },

        "/api/room/": {
            get: {
                summary: "Get all rooms in our system",
                tags: ["room"],
                description: "Returns lists of chat rooms in our system",
                produces: [
                    "application/json"
                ],
                responses: {
                    200: {
                        description: "List of available interests"
                    }
                }
            }
        }
    }
}