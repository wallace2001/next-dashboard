import ProjectCard from "@/app/dashboard/projects/components/product-card";
import NoResults from "@/components/no-results";
import { Project } from "../../../../../types";

interface ProjectListProps {
    items: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({
    items
}) => {
    return ( 
        <div className="space-y-4 mt-4">
            {items.length === 0 && (<NoResults />)}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {items.map(item => (
                    <div
                        className="col-span-2"
                        key={item.id}
                    >
                        <ProjectCard item={item} key={item.id} />
                    </div>
                ))}
            </div>
        </div>
     );
}
 
export default ProjectList;