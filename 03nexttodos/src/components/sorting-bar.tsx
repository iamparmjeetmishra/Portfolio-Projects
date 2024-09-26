import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SortingBar() {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="high-priority">High Priority</SelectItem>
            <SelectItem value="medium-priority">Medium Priority</SelectItem>
            <SelectItem value="low-priority">Low Priority</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by due date</SelectLabel>
            <SelectItem value="upcoming-task">Upcoming task</SelectItem>
            <SelectItem value="latest-task">Latest task</SelectItem>
            <SelectLabel>Sort by status</SelectLabel>
            <SelectItem value="to-do">To do</SelectItem>
            <SelectItem value="in-progress">In progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
