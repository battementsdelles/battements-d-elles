import { ConflictException } from '@/lib/custom-next-response';
import { getUserRepository } from '@/lib/helpers/typeorm/datasrc';
import { ICreateUserDto } from '@/lib/helpers/zod/schemas/user.registration';
import * as bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const [UserRepository, queryRunner] = await getUserRepository(true);
  await queryRunner?.connect();
  await queryRunner?.startTransaction();
  const userDto: ICreateUserDto = await request.json();

  try {
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
    queryRunner?.manager.save(newUser);

    await queryRunner?.commitTransaction();
    await queryRunner?.release();

    return new NextResponse('user has been created', { status: 201 });
  } catch (error) {
    await queryRunner?.rollbackTransaction();
    await queryRunner?.release();

    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
