import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => Category, category => category.items)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  order: number;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
