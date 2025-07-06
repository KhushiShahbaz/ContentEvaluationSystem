"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function EditProfileModal({
  formData,
  setFormData,
  role,
  onClose,
  onSave,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (role === "evaluator" && ["phone", "qualification", "experience", "address"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        evaluatorId: {
          ...prev.evaluatorId,
          [name]: value,
        },
      }));
    } else if (
      (role === "team-leader" || role === "team-member") &&
      ["projectTitle", "projectDescription", "teamCode"].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        teamId: {
          ...prev.teamId,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xl">
        <DialogHeader className="text-center mb-2">
          <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
        </DialogHeader>

        <form className="space-y-4">
          {/* Common Fields */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Full Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Email Address"
            />
          </div>

          {/* Evaluator Fields */}
          {role === "evaluator" && (
            <>
              <div className="flex gap-x-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    name="phone"
                    value={formData.evaluatorId?.phone || ""}
                    onChange={handleChange}
                    placeholder="Phone Number"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    name="qualification"
                    value={formData.evaluatorId?.qualification || ""}
                    onChange={handleChange}
                    placeholder="Qualification"
                  />
                </div>
              </div>

              <div className="flex gap-x-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    name="experience"
                    value={formData.evaluatorId?.experience || ""}
                    onChange={handleChange}
                    placeholder="Experience"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    name="address"
                    value={formData.evaluatorId?.address || ""}
                    onChange={handleChange}
                    placeholder="Address"
                  />
                </div>
              </div>
            </>
          )}

          {/* Team Leader Fields */}
          {role === "team-leader" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="projectTitle">Project Title</Label>
                <Input
                  name="projectTitle"
                  value={formData.teamId?.projectTitle || ""}
                  onChange={handleChange}
                  placeholder="Project Title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Project Description</Label>
                <Input
                  name="projectDescription"
                  value={formData.teamId?.projectDescription || ""}
                  onChange={handleChange}
                  placeholder="Project Description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamCode">Team Code</Label>
                <Input
                  name="teamCode"
                  value={formData.teamId?.teamCode || ""}
                  onChange={handleChange}
                  placeholder="Team Code"
                />
              </div>
            </>
          )}

          {/* Team Member Fields */}
          {role === "team-member" && (
            <div className="space-y-2">
              <Label htmlFor="teamCode">Team Code</Label>
              <Input
                name="teamCode"
                value={formData.teamId?.teamCode || ""}
                onChange={handleChange}
                placeholder="Team Code"
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={onSave}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
