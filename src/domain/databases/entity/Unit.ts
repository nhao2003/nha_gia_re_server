import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

interface UnitInterface {
  id: string;
  unit_name: string;
}

@Entity('units')
export class Unit extends BaseEntity implements UnitInterface {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column({ type: 'varchar', length: 50 })
    unit_name!: string;
}