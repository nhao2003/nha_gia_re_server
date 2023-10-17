import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity } from 'typeorm';

interface BlogInterface {
  id: string;
  created_at: Date;
  title: string;
  short_description: string;
  author: string;
  thumbnail: string;
  content_link: string;
  is_active: boolean;
}

@Entity('blogs')
class Blog extends BaseEntity implements BlogInterface {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  short_description!: string;

  @Column({ type: 'varchar', length: 50 })
  author!: string;

  @Column({ type: 'text' })
  thumbnail!: string;

  @Column({ type: 'text' })
  content_link!: string;

  @Column({ type: 'boolean' })
  is_active!: boolean;
}
export default Blog;