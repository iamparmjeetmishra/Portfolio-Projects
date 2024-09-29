import { List, SquareKanban } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";

type SortingBarProps = {
  setSortBy: (value: string) => void;
  setFilterBy: (value: string) => void;
  viewModeFunction: () => void;
  viewMode: boolean;
};

export default function SortingAndViewBar({
  setSortBy,
  setFilterBy,
  viewModeFunction,
  viewMode,
}: SortingBarProps) {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-center gap-4">
        <Button variant="outline" disabled={viewMode === !0}>
          <List
            className={`size-6 cursor-pointer ${viewMode === !0 ? "opacity-50" : ""}`}
            onClick={() => viewModeFunction()}
          />
        </Button>
        <Button variant="outline" disabled={viewMode === !1}>
          <SquareKanban
            className={`size-6 ${viewMode === !0 ? "" : "opacity-50"}`}
            onClick={() => viewModeFunction()}
          />
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Select onValueChange={setFilterBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="high-priority">High Priority</SelectItem>
              <SelectItem value="medium-priority">Medium Priority</SelectItem>
              <SelectItem value="low-priority">Low Priority</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by due date</SelectLabel>
              <SelectItem value="upcoming-task">Upcoming task</SelectItem>
              <SelectItem value="latest-task">Latest task</SelectItem>
              <SelectLabel>Sort by status</SelectLabel>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
