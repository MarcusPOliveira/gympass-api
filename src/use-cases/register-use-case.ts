import { hash } from 'bcryptjs'

import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

// example of SOLID principles: D of Dependency Inversion

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    // NOTE: Cannot use reply in this use case, so we throw an error instead:
    // if (userWithSameEmail) {
    //   return reply.status(409).send({
    //     message: 'User already exists with this email.',
    //   })
    // }

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    // NOTE: Cannot use this anymore, because we are using dependency inversions:
    // const prismaUsersRepository = new PrismaUsersRepository()

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
