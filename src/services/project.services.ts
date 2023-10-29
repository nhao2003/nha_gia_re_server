import { Project } from '~/domain/databases/entity/Project';
import CommonServices from './common.services';
import PropertyTypeProject from '~/domain/databases/entity/PropertyTypeProject';
import { Repository } from 'typeorm';
import ProjectScale from '~/domain/databases/entity/ProjectScale';
import { BaseQuery } from '~/models/PostQuery';

class ProjectServices extends CommonServices {
  propertyTypeProjectRepo: Repository<PropertyTypeProject>;
  projectScaleRepo: Repository<ProjectScale>;
  constructor() {
    super(Project);
    this.propertyTypeProjectRepo = PropertyTypeProject.getRepository();
    this.projectScaleRepo = ProjectScale.getRepository();
  }

  public async create(data: Record<string, any>) {
    const project_types: string[] | null = data.project_types;
    const scales:
      | {
          scale: number;
          unit_id: string;
        }[]
      | null = data.scales;
    data.verified = true;
    const project: Project = await super.create(data);
    if (project_types) {
      const propertyTypeProjects: PropertyTypeProject[] = project_types.map((property_type_id: string) => {
        const propertyTypeProject: PropertyTypeProject = new PropertyTypeProject();
        propertyTypeProject.projects_id = project.id;
        propertyTypeProject.property_types_id = property_type_id;
        return propertyTypeProject;
      });
      await this.propertyTypeProjectRepo.save(propertyTypeProjects);
    }
    if (scales) {
      const projectScales: ProjectScale[] = scales.map((scale: any) => {
        const projectScale: ProjectScale = new ProjectScale();
        projectScale.project_id = project.id;
        projectScale.scale = scale.scale;
        projectScale.unit_id = scale.unit_id;
        return projectScale;
      });
      await this.projectScaleRepo.save(projectScales);
    }
    return project;
  }

  public getAllByQuery(query: BaseQuery): Promise<any[]> {
    let { wheres, orders } = query;
    let baseQuery = this.getBaseQueryBuilder(query);
    baseQuery = baseQuery.leftJoinAndSelect('Project.developer', 'developer');
    baseQuery = baseQuery.leftJoinAndSelect('Project.property_types', 'property_types');
    baseQuery = baseQuery.leftJoinAndSelect('Project.scales', 'scales');
    if (wheres) {
      wheres.forEach((where) => {
        baseQuery = baseQuery.andWhere(where);
      });
    }
    if (orders) {
      baseQuery = baseQuery.orderBy(orders);
    }
    return baseQuery.getMany();
  }
  async update(id: string, data: Record<string, any>): Promise<any> {
    const project: Project = (await super.getById(id)) as Project;
    const project_types: string[] | null = data.project_types;
    const promieses = [];
    const scales:
      | {
          scale: number;
          unit_id: string;
        }[]
      | null = data.scales;

    if (project_types !== null && Array.isArray(project_types)) {
      const propertyTypeProjects = project_types.map((property_type_id: string) => ({
        projects_id: project.id,
        property_types_id: property_type_id,
      }));
      promieses.push(this.propertyTypeProjectRepo.delete({ projects_id: project.id }));
      promieses.push(this.propertyTypeProjectRepo.save(propertyTypeProjects));
    }
    if (scales !== null && Array.isArray(scales)) {
      const projectScales = scales.map((scale: any) => ({
        project_id: project.id,
        scale: scale.scale,
        unit_id: scale.unit_id,
      }));
      promieses.push(this.projectScaleRepo.delete({ project_id: project.id }));
      promieses.push(this.projectScaleRepo.save(projectScales));
    }
    // Update project
    delete data.project_types;
    delete data.scales;
    promieses.push(this.repository.update(id, data));
    const results = await Promise.all(promieses);
    return results[results.length - 1];
  }
}
export default new ProjectServices();