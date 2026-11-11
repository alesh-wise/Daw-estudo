import type { Request, Response, NextFunction } from "express";
import { Ajv, type Schema } from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv({ allErrors: true });
addFormats.default(ajv);

/**
* Middleware de ordem superior que compila um schema e valida o req.body do
pedido.
*/
export const validateSchema = (schema: Schema) => {
  const validate = ajv.compile(schema);
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Validar req.body usando a função validate(req.body)
    const valid = validate(req.body);

    // TODO: Se falhar, interromper o ciclo e responder com código 400 Bad
    if (!valid) {
      // Request, devolvendo os erros em JSON (validate.errors)
      return res.status(400).json({
        message: "Validation error",
        erros: validate.errors,
      });
    }
    // TODO: Se a validação for bem-sucedida, invocar next() para prosseguir
    next();
  };
};