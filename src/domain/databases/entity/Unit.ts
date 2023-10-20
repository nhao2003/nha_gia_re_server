import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import IUnit from '../interfaces/IUnit';
import { PrimaryColumn } from 'typeorm';
import { PostgresDataType } from '../constants/database_constants';
@Entity('units')
export class Unit extends BaseEntity implements IUnit {
  @PrimaryColumn({ type: PostgresDataType.varchar, length: 50 })
    id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
    unit_name!: string;
}