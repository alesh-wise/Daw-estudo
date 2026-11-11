import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "../../../shared/types.js";
const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_book_store_2026";
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}
/**
* Middleware que intercepta o cabeçalho Authorization: Bearer <token> e
valida a assinatura JWT.
*/
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  // TODO: Obter o cabeçalho 'authorization' do pedido
  const authHeader = req.headers["authorization"];

  // TODO: Extrair o token removendo o prefixo 'Bearer '
  // TODO: Se o token não existir, interromper e responder com status 401 Unauthorized
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  // TODO: Validar a assinatura com jwt.verify(token, JWT_SECRET)
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    // TODO: Se o token for inválido/expirado, responder com status 403 Forbidden
    if (err) {
      return res.status(403).json({ message: "Invalid/expired token" });
    }

    // TODO: Se for válido, associar o payload descodificado a req.user e invocar next()
    req.user = decoded as NonNullable<AuthenticatedRequest["user"]>;
    next();
  });
};
/**
 * Middleware para restrição de rotas com base no papel (RBAC).
 */
export const requireRole = (requiredRole: UserRole) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // TODO: Verificar se req.user existe e se req.user.role é igual a requiredRole (ex: 'admin')
    if (!req.user || req.user.role !== requiredRole) {
      // TODO: Se não possuir o papel exigido, responder com status 403 Forbidden
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }
    // TODO: Caso contrário, invocar next()
    next();
  };
};