import type { JSONSchemaType } from 'ajv';
import { ProductCategory } from '../../../../shared/types.js';
import type { Product } from '../../../../shared/types.js';
export const productValidationSchema: JSONSchemaType<Omit<Product, 'id'>> = {
    // TODO: Definir o objeto bookValidationSchema
    // Regras obrigatórias:
    // - properties:
    // * price: number maior que 0
    // * category: enum em conformidade com BookCategory
    // * stock: integer maior ou igual a 0
    // * description: string opcional (nullable: true)
    // - required: ["title", "author", "price", "category", "stock"]
    additionalProperties: false,
    "title": "Product",
     // - type: "object"
    "type": "object",
    "properties": {
        // * title: string com comprimento mínimo de 1 caracter
        name: {
            "type": "string",
            "minLength": 1
        },
         // * author: string com comprimento mínimo de 1 caracter
        supplier: {
            "type": "string",
            "minLength": 1
        },
        price: {
            "type": "number",
            "exclusiveMinimum": 0
        },
        stock: {
            "type": "number",
            "minimum": 0 
        },
        category: {type: "integer", enum: Object.values(ProductCategory).filter(
            (v): v is ProductCategory => typeof v === "number"
        )},
        description: {
            type: "string",
            nullable: true
        }
    },
    required:["name","supplier","price","stock","category"],
};
