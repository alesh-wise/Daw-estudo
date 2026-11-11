import type { JSONSchemaType } from "ajv";
import { ProductCategory } from "../../../../shared/types.js";
import type { Product } from "../../../../shared/types.js";
export const productValidationSchema: JSONSchemaType<Omit<Product, "id">> = {
  // TODO: Definir o objeto bookValidationSchema
  // Regras obrigatórias:
  type: "object",
  properties: {
    // * title: string com comprimento mínimo de 1 caracter
    name: {
      type: "string",
      minLength: 1,
    },
    // author: string com comprimento mínimo de 1 caracter
    supplier: {
      type: "string",
      minLength: 1,
    },
    // price: number maior que 0
    price: {
      type: "number",
      exclusiveMinimum: 0,
    },
    // category: enum em conformidade com BookCategory
    category: {
      type: "integer",
      enum: Object.values(ProductCategory).filter(
        (v): v is ProductCategory => typeof v === "number",
      ),
    },
    // stock: integer maior ou igual a 0
    stock: {
      type: "integer",
      minimum: 0,
    },
    // description: string opcional (nullable: true)
    description: {
      type: "string",
      nullable: true,
    },
  },
  required: ["name", "supplier", "price", "category", "stock"],
  additionalProperties: false,
};