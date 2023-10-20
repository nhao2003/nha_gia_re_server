import { Entity, BaseEntity, Column } from 'typeorm';
import { IPropertyType } from '../interfaces/IPropertyType';
import { PostgresDataType } from '../constants/database_constants';
import { PrimaryColumn } from 'typeorm';

@Entity('property_types_projects')
class PropertyType extends BaseEntity implements IPropertyType {
  @PrimaryColumn(PostgresDataType.uuid, {comment: 'This is the Primary Key'})
  id!: string;

  @Column({type: PostgresDataType.varchar, length: 50, comment: 'This is the Property Type Name'})
  name!: string;

  @Column({type: PostgresDataType.boolean, default: true, comment: 'Is the Property Type Active?'})
  is_active!: boolean;
}
export default PropertyType;
