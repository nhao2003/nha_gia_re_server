import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import IUnit from '../interfaces/IUnit';
import { PrimaryColumn } from 'typeorm';
import { PostgresDataType } from '../constants/database_constants';
@Entity('units')
export class Unit extends BaseEntity implements IUnit {
  @PrimaryColumn({ type: PostgresDataType.varchar, length: 50, comment: 'This is the Primary Key' })
  id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50, comment: 'This is the unit name' })
  unit_name!: string;

  @Column({ type: PostgresDataType.boolean, default: true, comment: 'This is the is_active' })
  is_active!: boolean;
}
