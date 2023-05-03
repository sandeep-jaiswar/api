import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly UsersRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    const newUser = this.UsersRepository.create(createUserDto);
    return this.UsersRepository.save(newUser);
  }

  findAll() {
    return this.UsersRepository.find();
  }

  async findOne(id: number) {
    return await this.UsersRepository.findOne({
      where: { id },
    });
  }

  async findOneByEmail(email: string) {
    return await this.UsersRepository.findOne({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.UsersRepository.save(user);
  }

  remove(id: number) {
    return this.UsersRepository.delete(id);
  }
}
