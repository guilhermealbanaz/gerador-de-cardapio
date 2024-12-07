import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

@Entity('analytics')
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'restaurant_id' })
  restaurantId: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ name: 'event_type' })
  eventType: string;

  @Column({ name: 'event_data', type: 'jsonb', nullable: true })
  eventData: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
