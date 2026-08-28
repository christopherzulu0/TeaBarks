"use client";

import * as React from "react";
import {
  MoreHorizontal,
  Search,
  ShieldAlert,
  Trash2,
  UserCog,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { PersonAvatar } from "@/components/person-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { organization } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { orgRoleMeta } from "@/lib/meta";
import type { OrgMember, OrgRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<OrgMember["status"], string> = {
  active: "bg-agree/15 text-agree border-agree/30",
  invited: "bg-mixed/20 text-mixed-foreground border-mixed/40 dark:text-mixed",
  suspended: "bg-disagree/15 text-disagree border-disagree/30",
};

export function TeamTable() {
  const roles = React.useMemo(() => Object.keys(orgRoleMeta) as OrgRole[], []);
  const [members, setMembers] = React.useState(organization.members);
  const [search, setSearch] = React.useState("");
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<OrgRole>("writer");

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const invite = () => {
    if (!inviteEmail.includes("@")) {
      toast.error("Enter a valid email address.");
      return;
    }
    const name = inviteEmail
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    setMembers((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        name,
        email: inviteEmail,
        role: inviteRole,
        status: "invited",
        lastLogin: "—",
      },
    ]);
    toast.success(`Invitation sent to ${inviteEmail}`, {
      description: `Role: ${orgRoleMeta[inviteRole].label}`,
    });
    setInviteEmail("");
    setInviteOpen(false);
  };

  const changeRole = (id: string, role: OrgRole) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    toast.success("Role updated");
  };

  const remove = (member: OrgMember) => {
    setMembers((prev) => prev.filter((m) => m.id !== member.id));
    toast.success(`${member.name} removed from the organization`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members…"
            aria-label="Search members"
            className="pl-9"
          />
        </div>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="size-4" /> Invite member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a team member</DialogTitle>
              <DialogDescription>
                They&apos;ll receive an email invitation to join{" "}
                {organization.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@organization.org"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={inviteRole}
                  onValueChange={(v) => setInviteRole(v as OrgRole)}
                >
                  <SelectTrigger className="w-full" aria-label="Select role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>
                        <span className="font-medium">
                          {orgRoleMeta[r].label}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {orgRoleMeta[r].description}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button onClick={invite}>Send invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Last Login</TableHead>
              <TableHead className="w-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <PersonAvatar id={m.id} name={m.name} className="size-8" />
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground md:hidden">
                        {m.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {m.email}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{orgRoleMeta[m.role].label}</Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge
                    variant="outline"
                    className={cn("capitalize", statusStyles[m.status])}
                  >
                    {m.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {m.lastLogin === "—" ? "—" : formatDate(m.lastLogin)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${m.name}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuLabel>Change role</DropdownMenuLabel>
                      {roles.map((r) => (
                        <DropdownMenuItem
                          key={r}
                          disabled={r === m.role}
                          onClick={() => changeRole(m.id, r)}
                        >
                          <UserCog />
                          {orgRoleMeta[r].label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          toast(`${m.name} suspended`, {
                            description: "They can no longer access the workspace.",
                          })
                        }
                      >
                        <ShieldAlert /> Suspend
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => remove(m)}
                      >
                        <Trash2 /> Remove from org
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
