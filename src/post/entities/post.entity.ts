import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {OutputBlockData} from "../dto/create-post.dto";
import {UserEntity} from "../../user/entities/user.entity";

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string;

  @Column({ default: [], type: 'jsonb' })
  body: OutputBlockData[];

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => UserEntity, {eager: true})
  user: UserEntity;

  @Column({ default: 0 })
  views: number;

  @Column({ default: '' })
  tags: string;

  @CreateDateColumn({type: 'timestamp'})
  createdAt: Date

  @UpdateDateColumn({type: 'timestamp'})
  updatedAt: Date
}
