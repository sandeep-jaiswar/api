import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sub: string;

  @Column()
  name: string;

  @Column()
  given_name: string;

  @Column()
  family_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  picture: string;

  @Column()
  locale: string;

  @Column({ default: false })
  email_verified: boolean;
}
