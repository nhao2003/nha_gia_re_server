import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import IDiscountCode from "../interfaces/IDiscountCode";
import { PostgresDataType } from "../constants/database_constants";
import { Entity } from "typeorm";

@Entity('discount_codes')
class DiscountCode extends BaseEntity implements IDiscountCode {
    @PrimaryGeneratedColumn(PostgresDataType.uuid)
    id!: string;
  
    @Column({ type: PostgresDataType.uuid })
    package_id!: string;
  
    @Column({type: PostgresDataType.varchar, length: 50})
    code!: string;
  
    @Column({ type: PostgresDataType.double_precision, default: 0 })
    discount_percent!: number;
  
    @Column({ type: PostgresDataType.date})
    starting_date!: Date;
  
    @Column({ type: PostgresDataType.date})
    expiration_date!: Date;
  
    @Column({ type: PostgresDataType.text})
    description!: string;
  
    @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone})
    created_at!: Date;

    @Column({ type: PostgresDataType.integer, nullable: true})
    limited_quantity!: number | null;
  
    @Column({ type: PostgresDataType.boolean, default: 'true'})
    is_active!: boolean;
}
export default DiscountCode;