import { Providers } from '@/lib/helpers/enums';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Exclude()
  @Column({ nullable: true })
  password!: string;

  @Exclude()
  @Column({ type: 'enum', enum: Providers, default: Providers.CREDENTIALS })
  provider!: Providers;

  @Column({ default: true })
  isActive!: boolean;

  @Exclude()
  @Column({ type: String, nullable: true })
  refreshToken!: string | null;

  @Exclude()
  @Column({ type: String, nullable: true })
  accessToken!: string | null;

  @Exclude()
  @Column({ default: 0 })
  accessTokenExpires!: number;
}
