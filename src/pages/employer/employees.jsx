import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/common/Icon.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import Segmented from "@/components/common/Segmented.jsx";
import EmployeeCard from "@/components/employer/employees/EmployeeCard.jsx";
import { STATUS } from "@/components/employer/team-styles.js";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeam } from "@/lib/team-store.js";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "needs", label: "Needs check-in" },
  { value: "stable", label: "Stable" },
];

// Employees (design: Employer Portal → emps): direct reports, searchable by
// anything they shared, filterable by status, sortable by name or status.
function Employees() {
  const navigate = useNavigate();
  const { people } = useTeam();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name");

  const q = query.trim().toLowerCase();
  const list = people
    .filter(
      (p) =>
        (filter === "all" || (filter === "stable" ? p.status === "stable" : p.status !== "stable")) &&
        (!q || [p.name, p.role, p.team, ...p.tags, ...p.profile.flatMap((s) => s.fields.map((f) => f.value))].join(" ").toLowerCase().includes(q)),
    )
    .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : STATUS[a.status].rank - STATUS[b.status].rank));

  const stats = [
    { n: people.length, label: "Direct reports", ink: "text-ink" },
    { n: people.filter((p) => p.status !== "stable").length, label: "Need a check-in", ink: "text-primary" },
    { n: people.filter((p) => p.status === "stable").length, label: "Stable", ink: "text-teal-ink" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Your direct reports" title="Employees" />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] gap-3.5">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1 rounded-3xl border border-divider bg-surface-container-lowest px-[1.375rem] py-[1.125rem]">
            <span className={`text-[2rem] leading-none font-extrabold tabular-nums ${s.ink}`}>{s.n}</span>
            <span className="text-body-lg text-ink-soft">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <InputGroup className="h-13 flex-[1_1_20rem] border-[1.5px]">
          <InputGroupAddon>
            <Icon name="search" className="text-[22px] text-slate" />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, role, team, preference or support need"
            aria-label="Search employees"
            className="text-body-lg font-normal"
          />
        </InputGroup>
        <Segmented
          value={filter}
          onChange={setFilter}
          options={FILTERS}
          label="Filter by status"
          size="lg"
          className="border border-divider bg-surface-container-lowest"
          itemClassName="h-[2.625rem] px-4 text-body-md font-bold"
        />
        <div className="flex h-13 items-center gap-2 rounded-full border border-divider bg-surface-container-lowest pr-1.5 pl-4 text-body-md font-bold text-slate">
          <span id="sort-label">Sort</span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger aria-labelledby="sort-label" size="sm" className="h-10 border-0 bg-fill">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {list.map((person) => (
          <EmployeeCard key={person.id} person={person} onOpen={() => navigate(`/employer/employees/${person.id}`)} />
        ))}
        {!list.length ? <span className="py-7 text-body-lg text-slate">No one matches. Try another word or filter.</span> : null}
      </div>
    </div>
  );
}

export default Employees;
