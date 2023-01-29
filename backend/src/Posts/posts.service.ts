import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './posts.entity';
import { Repository } from 'typeorm';
import { ImageEntity } from 'src/Images/Images.entity';
import { UserPostLikeEntity } from 'src/UserPostLikes/userPostLikes.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    @InjectRepository(UserPostLikeEntity)
    private readonly likeRepository: Repository<UserPostLikeEntity>,
  ) {}

  async createPost(userId, body, imgUrl) {
    const { content } = body;
    const newPost = await this.postRepository.save({ userId, content });
    await this.imageRepository.save({ imgUrl, postId: newPost.id });
    return newPost;
  }

  async changePost(postId, body, userId) {
    const { content } = body;

    const result = await this.postRepository
      .createQueryBuilder()
      .update(PostEntity)
      .set({
        content: content,
      })
      .where('id = :id', { id: postId })
      .andWhere('userId=:userId', { userId: userId })
      .execute();
    if (result.affected === 0) {
      throw new ForbiddenException();
    }
    return;
  }

  async deletePost(data) {
    const { userId, id } = data;
    const result = await this.postRepository
      .createQueryBuilder()
      .softDelete()
      .from(PostEntity)
      .where('id = :id', { id: id })
      .andWhere('userId=:userId', { userId: userId })
      .execute();

    if (result.affected === 0) {
      throw new ForbiddenException();
    }
    return;
  }

  async findAllPost() {
    const result = await this.postRepository
      .createQueryBuilder('p')
      .select([
        'p.id',
        'p.content',
        'p.createdAt',
        'p.updatedAt',
        'user.nickname',
        'image.imgUrl',
        'likes',
      ])
      .leftJoin('p.user', 'user')
      .leftJoin('p.image', 'image')
      .leftJoin('p.userPostLike', 'likes')
      .getMany();
    return result.map((post) => {
      return {
        id: post.id,
        content: post.content,
        nickname: post.user.nickname,
        imageUrl: post.image[0].imgUrl,
        createAt: post.createdAt,
        updateAt: post.updatedAt,
        likes: post.userPostLike.length,
      };
    });
  }

  async findOnePost(postId: number) {
    const result = await this.postRepository
      .createQueryBuilder('p')
      .select([
        'p.id',
        'p.content',
        'p.createdAt',
        'p.updatedAt',
        'user.nickname',
        'image.imgUrl',
        'likes',
      ])
      .where('p.id = :id', { id: postId })
      .leftJoin('p.user', 'user')
      .leftJoin('p.image', 'image')
      .leftJoin('p.userPostLike', 'likes')
      .getOne();
    if (!result) throw new NotFoundException();
    return {
      id: result.id,
      content: result.content,
      nickname: result.user.nickname,
      imageUrl: result.image[0].imgUrl,
      createAt: result.createdAt,
      updateAt: result.updatedAt,
      likes: result.userPostLike.length,
    };
  }

  async likeEvent(data) {
    //있는 포스트인지 검사
    const { id, userId } = data;
    const result = await this.postRepository.findOneBy({ id: id });
    if (!result) throw new NotFoundException();

    const existLike = await this.likeRepository.findOne({
      where: {
        userId: userId,
        postId: id,
      },
    });
    if (!existLike) {
      const result = await this.likeRepository.save({ userId, postId: id });
      return result;
    } else {
      const result = await this.likeRepository.delete({
        userId: userId,
        postId: id,
      });
      return result;
    }
  }
}
