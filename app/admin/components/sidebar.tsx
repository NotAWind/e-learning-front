import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  UserRoundCog,
  UserRoundPlus,
  ListCollapse,
  FilePlus2,
  School,
} from "lucide-react";

export function Sidebar() {
  return (
    <div className={`${cn("pb-12")}`}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            User
          </h2>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              <UserRoundCog className="mr-2 h-4 w-4" />
              Users List
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <UserRoundPlus className="mr-2 h-4 w-4" />
              Add Users
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Course
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <ListCollapse className="mr-2 h-4 w-4" />
              Courses List
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FilePlus2 className="mr-2 h-4 w-4" />
              Course Add
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            School
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <School className="mr-2 h-4 w-4" />
              School
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
