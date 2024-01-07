import { Project } from '~/domain/databases/entity/Project';
import CommonServices from './common.service';
import { DataSource, Repository } from 'typeorm';
import { BaseQuery } from '~/models/PostQuery';
import { AppDataSource } from '~/app/database';
import { Service } from 'typedi';
import AppConfig from '~/constants/configs';
@Service()
class ProjectServices extends CommonServices {
  constructor(dataSource: DataSource) {
    super(Project, dataSource);
  }

  public async create(data: Record<string, any>) {
    data.verified = true;
    const project: Project = await super.create(data);
    return project;
  }

  public async getAllByQuery(query: BaseQuery): Promise<{
    num_of_pages: number;
    data: Project[];
  }> {
    let { page } = query;
    const { wheres, orders } = query;
    let skip = undefined;
    let take = undefined;
    if (page !== 'all') {
      page = isNaN(Number(page)) ? 1 : Number(page);
      skip = (page - 1) * AppConfig.ResultPerPage;
      take = AppConfig.ResultPerPage;
    }
    let baseQuery = this.repository.createQueryBuilder();
    baseQuery = baseQuery.leftJoinAndSelect('Project.developer', 'developer');
    // baseQuery = baseQuery.leftJoinAndSelect('Project.property_types', 'property_types');
    baseQuery = baseQuery.leftJoinAndSelect('Project.scales', 'scales');
    if (wheres) {
      wheres.forEach((where) => {
        baseQuery = baseQuery.andWhere(where);
      });
    }
    if (orders) {
      baseQuery = baseQuery.orderBy(orders);
    }
    const getCount = baseQuery.getCount();
    const getMany = baseQuery.skip(skip).take(take).getMany();
    const res = await Promise.all([getMany, getCount]);
    return {
      num_of_pages: Math.ceil(res[1] / AppConfig.ResultPerPage),
      data: res[0],
    };
  }
  async update(id: string, data: Record<string, any>): Promise<any> {
    const promieses = [];

    // Update project
    delete data.project_types;
    delete data.scales;
    promieses.push(this.repository.update(id, data));
    const results = await Promise.all(promieses);
    return results[results.length - 1];
  }

  async deleteUnverifiedProject(id: string): Promise<void> {
    await this.repository.delete({
      id,
      verified: false,
    });
  }

  async createUnverifiedProject(name: string): Promise<Project> {
    const project: Project = new Project();
    project.project_name = name;
    project.verified = false;
    // Return id of project
    const result = await this.repository.save(project);
    return result;
  }

  async getOrCreateUnverifiedProject(id: string | null, project_name: string | null): Promise<string | null> {
    if (id) {
      const project: Project = (await this.getById(id)) as Project;
      if (project) {
        return project.id;
      }
    }
    if (project_name) {
      const project: Project = await this.repository.findOne({
        where: {
          project_name,
          verified: false,
        },
      });
      if (project) {
        return project.id;
      }
    }
    if (!project_name) {
      return null;
    }
    const project: Project = await this.createUnverifiedProject(project_name);
    return project.id;
  }
}
export default ProjectServices;
