import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { School } from "../utils/type";

type EditSchoolDialogProps = {
  school: School | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (school: School) => void;
};

export default function EditSchoolDialog({
  school,
  isOpen,
  onClose,
  onSave,
}: EditSchoolDialogProps) {
  const [name, setName] = React.useState(school?.name || "");

  React.useEffect(() => {
    if (school) {
      setName(school.name);
    }
  }, [school]);

  const handleSave = () => {
    if (school) {
      onSave({ ...school, name });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit School</DialogTitle>
          <DialogDescription>Update the name of the school.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="School Name"
          />
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
