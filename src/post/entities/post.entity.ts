import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  body: string;

  @Column({ default: '' })
  tags: string;

  @CreateDateColumn({type: 'timestamp'})
  createdAt: Date

  @UpdateDateColumn({type: 'timestamp'})
  updatedAt: Date
}
