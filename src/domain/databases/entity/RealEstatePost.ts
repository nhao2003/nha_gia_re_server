import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import IRealEstatePost from '../interfaces/IRealEstatePost';
import { PostgresDataType } from '../constants/database_constants';
import { CreateDateColumn } from 'typeorm';

@Entity('real_estate_posts')
export class RealEstatePost extends BaseEntity implements IRealEstatePost {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column(PostgresDataType.uuid)
  user_id!: string;

  @Column(PostgresDataType.uuid, { nullable: true })
  project_id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  type_id!: string;

  @Column(PostgresDataType.uuid)
  unit_id!: string;

  @Column({ type: PostgresDataType.varchar, nullable: true })
  status!: string;

  @Column(PostgresDataType.text)
  title!: string;

  @Column(PostgresDataType.text)
  description!: string;

  @Column(PostgresDataType.double_precision)
  area!: number;

  @Column(PostgresDataType.jsonb)
  address: any;

  @Column(PostgresDataType.point, { nullable: true })
  address_point!: string;

  @Column(PostgresDataType.bigint)
  price!: number;

  @Column(PostgresDataType.bigint, { nullable: true })
  desposit!: number;

  @Column(PostgresDataType.boolean)
  is_lease!: boolean;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone})
  posted_date!: Date;

  @Column(PostgresDataType.timestamp_without_timezone)
  expiry_date!: Date;

  @Column(PostgresDataType.text, { array: true })
  images!: string[];

  @Column(PostgresDataType.text, { array: true, nullable: true })
  videos!: string[];

  @Column(PostgresDataType.boolean)
  is_pro_seller!: boolean;

  @Column(PostgresDataType.jsonb)
  info_message: any;

  @Column(PostgresDataType.boolean)
  is_priority!: boolean;

  @Column(PostgresDataType.jsonb)
  features: any;

  @Column(PostgresDataType.boolean)
  post_approval_priority!: boolean;

  @Column(PostgresDataType.boolean)
  is_active!: boolean;

  //   // Many-to-One relationship with User
  //   @ManyToOne(() => User, (user) => user.real_estate_posts)
  //   @JoinColumn({ name: 'user_id' })
  //   user: User;

  //   // Many-to-One relationship with Project
  //   @ManyToOne(() => Project, (project) => project.real_estate_posts)
  //   @JoinColumn({ name: 'project_id' })
  //   project: Project;

  //   // Many-to-One relationship with PropertyType
  //   @ManyToOne(() => PropertyType, (property_type) => property_type.real_estate_posts)
  //   @JoinColumn({ name: 'type_id' })
  //   property_type: PropertyType;

  //   // Many-to-One relationship with Unit
  //   @ManyToOne(() => Unit, (unit) => unit.real_estate_posts)
  //   @JoinColumn({ name: 'unit_id' })
  //   unit: Unit;
}
