import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsersRepository } from '../users/users.repository.js';
const router = Router();
const usersRepository = new UsersRepository();
const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_bookstore';
// TODO: ROTA POST /auth/register
router.post('/auth/register', async (req: Request, res: Response) => {

    // 1. Extrair name, email, password e role do req.body
    const { name, email, password, role } = req.body
    if (!name || !email || !password || !role) return res.status(400).json({ 'message': "User invalido" })


    // 2. Validar campos obrigatórios e verificar se o email já se encontra registado (usersRepository.getByEmail)
    const exist = usersRepository.getByEmail(email)

    if (!exist) {

        // 3. Gerar a hash de password segura usando bcrypt.hash(password, 10)
        const hash = await bcrypt.hash(password, 10)
        const newUser = {
            name: name,
            email: email,
            passwordHash: hash,
            role: role
        }

        // 4. Guardar a nova conta com usersRepository.create
        await usersRepository.create(newUser)

        // 5. Responder com código 201 Created
        res.status(201).json({ 'message': "Criado com sucesso" })
    }
})

// TODO: ROTA POST /auth/login
router.post('/auth/login', async (req: Request, res: Response) => {
    try {
        // 1. Extrair email e password do req.body
        const { email, password } = req.body

        const exist = await usersRepository.getByEmail(email)

        // 2. Verificar a existência do utilizador via usersRepository.getByEmail (retornar 401 se não existir)
        if (!exist) {
            return res.status(401).json({ 'message': `Não existe utilizador associado ao email: ${email}` })
        }

        // 3. Comparar a palavra-passe recebida com a hash guardada usando bcrypt.compare(password, user.passwordHash)
        const isMatch = await bcrypt.compare(password, exist.passwordHash)
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
        const payload = { id: exist.id, email: exist.email, role: exist.role };
        const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" })
        return res.status(200).json({
            token,
            user: {
                id: exist.id,
                name: exist.name,
                email: exist.email,
                role: exist.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do servior" });
    }
})
// 4. Se válida, gerar o Token JWT assinado contendo os dados do utilizador (id, email, role) e tempo de expiração usando jwt.sign
// 5. Responder com status 200 OK devolvendo o token de acesso em JSON
export default router;