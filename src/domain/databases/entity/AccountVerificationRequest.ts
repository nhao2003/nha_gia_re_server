import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostgresDataType } from '../constants/database_constants';
import { User } from './User';

export interface IAccountVerificationRequest {
  id: string;
  is_verified: boolean;
  reviewed_at: Date | null; // Assuming the timestamp is represented as a string for simplicity
  rejected_info: string | null;
  user_id: string;
  request_date: string; // Assuming the timestamp is represented as a string for simplicity
  front_identity_card_image_link: string;
  back_identity_card_image_link: string;
  portrait_image_link: string;
  full_name: string;
  sex: boolean;
  dob: string; // Assuming the timestamp is represented as a string for simplicity
  identity_card_no: string;
  identity_card_issued_date: string; // Assuming the timestamp is represented as a string for simplicity
  issued_by: string;
}

@Entity('account_verification_requests')
class AccountVerificationRequest extends BaseEntity implements IAccountVerificationRequest {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column(PostgresDataType.boolean)
  is_verified!: boolean;

  @Column(PostgresDataType.timestamp_without_timezone)
  reviewed_at!: Date | null;

  @Column(PostgresDataType.text, { nullable: true })
  rejected_info!: string | null;

  @Column(PostgresDataType.uuid)
  user_id!: string;

  @Column(PostgresDataType.timestamp_without_timezone, { default: 'now()' })
  request_date!: string;

  @Column(PostgresDataType.text)
  front_identity_card_image_link!: string;

  @Column(PostgresDataType.text)
  back_identity_card_image_link!: string;

  @Column(PostgresDataType.text)
  portrait_image_link!: string;

  @Column(PostgresDataType.text)
  full_name!: string;

  @Column(PostgresDataType.boolean)
  sex!: boolean;

  @Column(PostgresDataType.timestamp_without_timezone)
  dob!: string;

  @Column(PostgresDataType.text)
  identity_card_no!: string;

  @Column(PostgresDataType.timestamp_without_timezone)
  identity_card_issued_date!: string;

  @Column(PostgresDataType.text)
  issued_by!: string;

  @ManyToOne(() => User, (user) => user.account_verification_requests)
  @JoinColumn({ name: 'user_id' })
  user!: string;
}

export { AccountVerificationRequest };
