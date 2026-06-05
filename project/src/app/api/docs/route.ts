import { NextResponse } from "next/server";

export async function GET() {
    const spec = {
        openapi: "3.0.3",
        info: {
            title: "Інтернет-магазин дизайнерських годинників API",
            description: "Специфікація API для курсового проекту з вебпрограмування.",
            version: "1.0.0"
        },
        paths: {
            "/api/products": {
                get: {
                    summary: "Отримання списку товарів (годинників) з фільтрацією",
                    description: "Повертає список годинників, що відповідають заданим фільтрам. Доступно для всіх користувачів.",
                    parameters: [
                        {
                            name: "category",
                            in: "query",
                            description: "Slug категорії для фільтрації (наприклад, men, women)",
                            required: false,
                            schema: {
                                type: "string"
                            }
                        },
                        {
                            name: "brand",
                            in: "query",
                            description: "ID бренду для фільтрації",
                            required: false,
                            schema: {
                                type: "integer"
                            }
                        },
                        {
                            name: "minPrice",
                            in: "query",
                            description: "Мінімальна ціна товарів",
                            required: false,
                            schema: {
                                type: "number",
                                format: "float"
                            }
                        },
                        {
                            name: "maxPrice",
                            in: "query",
                            description: "Максимальна ціна товарів",
                            required: false,
                            schema: {
                                type: "number",
                                format: "float"
                            }
                        },
                        {
                            name: "search",
                            in: "query",
                            description: "Текстовий пошуковий запит (шукає в назві та описі)",
                            required: false,
                            schema: {
                                type: "string"
                            }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Успішне отримання списку товарів",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Product"
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Помилка на сервері",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/ErrorResponse"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/orders": {
                post: {
                    summary: "Створення нового замовлення",
                    description: "Створює замовлення на основі поточного вмісту кошика авторизованого користувача. Кошик після цього очищується.",
                    security: [
                        {
                            cookieAuth: []
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["address", "phone"],
                                    properties: {
                                        address: {
                                            type: "string",
                                            description: "Адреса доставки замовлення",
                                            example: "м. Житомир, вул. Чуднівська, 103, кв. 15"
                                        },
                                        phone: {
                                            type: "string",
                                            description: "Контактний номер телефону отримувача",
                                            example: "+380671234567"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        "201": {
                            description: "Замовлення успішно створено",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/Order"
                                    }
                                }
                            }
                        },
                        "401": {
                            description: "Необхідна авторизація користувача",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/ErrorResponse"
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Помилка валідації (наприклад, кошик порожній)",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/ErrorResponse"
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Помилка створення замовлення на сервері",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/ErrorResponse"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "next-auth.session-token"
                }
            },
            schemas: {
                Product: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "Rolex Submariner Date" },
                        description: {
                            type: "string",
                            example: "Преміальний механічний годинник з автопідзаводом та водозахистом до 300м."
                        },
                        price: { type: "string", example: "12500.00" },
                        imageUrl: { type: "string", nullable: true, example: "/images/rolex-sub.jpg" },
                        stock: { type: "integer", example: 5 },
                        categoryId: { type: "integer", example: 1 },
                        brandId: { type: "integer", example: 2 },
                        createdAt: { type: "string", format: "date-time", example: "2026-06-05T12:00:00.000Z" },
                        category: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                name: { type: "string" },
                                slug: { type: "string" }
                            }
                        },
                        brand: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                name: { type: "string" },
                                country: { type: "string" }
                            }
                        }
                    }
                },
                Order: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 42 },
                        userId: { type: "integer", example: 3 },
                        status: {
                            type: "string",
                            enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
                            example: "PENDING"
                        },
                        total: { type: "number", format: "float", example: 12500.00 },
                        address: { type: "string", example: "м. Житомир, вул. Чуднівська, 103, кв. 15" },
                        phone: { type: "string", example: "+380671234567" },
                        createdAt: { type: "string", format: "date-time", example: "2026-06-05T14:20:00.000Z" },
                        orderItems: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    orderId: { type: "integer" },
                                    productId: { type: "integer" },
                                    quantity: { type: "integer" },
                                    price: { type: "string" },
                                    product: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            name: { type: "string" },
                                            imageUrl: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        error: { type: "string", example: "Помилка виконання операції" }
                    }
                }
            }
        }
    };

    return NextResponse.json(spec);
}
