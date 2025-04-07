import {
  ConflictException,
  CustomResponse,
} from '@/lib/helpers/custom-next-response';
import { getUserRepository } from '@/lib/typeorm/datasrc';
import { ICreateUserDto } from '@/lib/zod/schemas/user.registration';
import * as bcrypt from 'bcrypt';
import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const [UserRepository, queryRunner] = await getUserRepository(true);
    const userDto: ICreateUserDto = await request.json();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const existingUser = await UserRepository.findOne({
        where: { email: userDto.email },
      });

      if (existingUser) {
        return new ConflictException(
          'Account with the same email already exists.',
          {
            code: 'EMAIL_ALREADY_EXISTS',
            path: 'email',
            details: 'Account with the same email already exists.',
          },
        );
      }

      const salt = bcrypt.genSaltSync(10);
      userDto.password = bcrypt.hashSync(userDto.password, salt);

      const newUser = UserRepository.create(userDto);
      await queryRunner.manager.save(newUser);

      await queryRunner?.commitTransaction();
      await queryRunner?.release();

      return new CustomResponse(201, 'user has been created');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      console.log(error);
      return new CustomResponse(500, 'Internal Server Error');
    }
  } catch (error) {
    console.log(error);
    return new CustomResponse(500, 'Internal Server Error');
  }
};
