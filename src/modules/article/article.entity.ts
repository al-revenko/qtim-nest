import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { ManyToOne } from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    type: 'text',
  })
  content: string;

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @Column({
    type: 'timestamptz',
  })
  publishDate: Date;
}
