import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Menu } from '../../menu/entities/menu.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'subscription_status', default: 'free' })
  subscriptionStatus: string;

  @Column({ name: 'subscription_id', nullable: true })
  subscriptionId: string;

  @Column({ name: 'stripe_customer_id', nullable: true })
  stripeCustomerId: string;

  @OneToMany(() => Menu, menu => menu.restaurant)
  menus: Menu[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
