import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Menu } from './menu.entity';
import { Item } from './item.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'menu_id' })
  menuId: string;

  @ManyToOne(() => Menu, menu => menu.categories)
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @Column()
  order: number;

  @OneToMany(() => Item, item => item.category)
  items: Item[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
