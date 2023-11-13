import { ReportStatus, ReportType, ReportContentType } from '~/constants/enum';
import IReport from '../interfaces/IReport';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, VirtualColumn } from 'typeorm';
import { PostgresDataType } from '../constants/database_constants';
import { User } from './User';
import { RealEstatePost } from './RealEstatePost';

@Entity('reports')
class Report implements IReport {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column({ type: PostgresDataType.uuid })
  reporter_id!: string;

  @Column({ type: PostgresDataType.uuid })
  reported_id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  status!: ReportStatus;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  type!: ReportType;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  content_type!: ReportContentType;

  @Column({ type: PostgresDataType.text })
  description!: string;

  @Column({ type: PostgresDataType.text, array: true, nullable: true })
  images?: string[] | null | undefined;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  created_date!: Date;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'reporter_id' })
  reporter!: User;

  reported!: RealEstatePost | User;

}

export default Report;
