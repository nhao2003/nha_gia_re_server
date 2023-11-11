import CommonServices from "./common.services";
import Report from "../domain/databases/entity/Report";
import { BaseQuery } from "~/models/PostQuery";
import { RealEstatePost } from "~/domain/databases/entity/RealEstatePost";
class ReportService extends CommonServices {
    constructor() {
        super(Report);
    }

    public getAllByQuery(query: BaseQuery): Promise<any[]> {
        let { wheres, orders } = query;
        let devQuery = this.getBaseQueryBuilder(query);
        devQuery = devQuery.leftJoinAndSelect("Report.user", "user");
        devQuery = devQuery.setParameters({ current_user_id: null });
        if (wheres) {
          wheres.forEach((where) => {
            devQuery = devQuery.andWhere("Report." + where);
          });
        }
        if (orders) {
          devQuery = devQuery.orderBy(orders);
        }
        return devQuery.getMany();
    }
}

export default new ReportService();