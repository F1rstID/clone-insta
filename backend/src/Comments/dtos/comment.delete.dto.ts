import { PickType } from '@nestjs/swagger';
import { CommentEntity } from '../comments.entity';

export class CommentUpdateDto extends PickType(CommentEntity, [
  'user',
] as const) {}
