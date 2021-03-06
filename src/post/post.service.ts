import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PostEntity} from "./entities/post.entity";
import {CreatePostDto} from "./dto/create-post.dto";
import {SearchPostDto} from "./dto/search-post.dto";
import {UserEntity} from "../user/entities/user.entity";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private repository: Repository<PostEntity>,
  ) {}

  create(dto: CreatePostDto, userId: number) {
    const firstParagraph = dto.body.find(obj => obj.type === 'paragraph' )?.data.text

    return this.repository.save({
      title: dto.title,
      body: dto.body,
      tags: dto.tags,
      user: { id: userId },
      description: firstParagraph || '',
    });
  }

  findAll() {
    return this.repository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async popular() {
    const qb = this.repository.createQueryBuilder()

    qb.orderBy('views', 'DESC')
    qb.limit(10)

    const [items, total] = await qb.getManyAndCount()

    return {
      items,
      total
    }
  }

  async search(dto: SearchPostDto) {
    const qb = this.repository.createQueryBuilder('posts')

    qb.leftJoinAndSelect('posts.user', 'user')

    qb.limit(dto.limit || 0)
    qb.take(dto.take || 10)

    if (dto.views) {
      qb.orderBy('views', dto.views)
    }

    if (dto.body) {
      qb.andWhere(`posts.body ILIKE :body`)
    }

    if (dto.title) {
      qb.andWhere(`posts.title ILIKE :title`)
    }

    if (dto.tag) {
      qb.andWhere(`posts.tag ILIKE :tag`)
    }

    qb.setParameters({
      title: `%${dto.title}%`,
      body: `%${dto.body}%`,
      tag: `%${dto.tag}%`,
      view: dto.views || ''
    })

    const [items, total] = await qb.getManyAndCount()

    return {items, total}
  }

  async findOne(id: number) {
    const qb = await this.repository.createQueryBuilder('posts')

    await qb
      .whereInIds(id)
      .update()
      .set({
        'views': () => 'views + 1'
      })
      .execute()

    return this.repository.findOne(id);
  }

  async update(id: number, dto: UpdatePostDto, userId: number) {
    const find = await this.repository.findOne(+id)

    if (!find) {
      throw new NotFoundException('???????????? ???? ??????????????')
    }

    const firstParagraph = dto.body.find(obj => obj.type === 'paragraph' )?.data.text

    return this.repository.update(id, {
      title: dto.title,
      body: dto.body,
      tags: dto.tags || '',
      user: { id: userId },
      description: firstParagraph || '',
    });
  }

  async remove(id: number, userId: number) {
    const find = await this.repository.findOne(id)

    if (!find) {
      throw new NotFoundException('???????????? ???? ??????????????')
    }

    if (find.user.id !== userId) {
      throw new ForbiddenException('?????? ?????????????? ?? ???????? ????????????!')
    }
    return this.repository.delete(id);
  }
}
