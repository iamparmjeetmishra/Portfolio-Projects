import { useMemo, useState } from "react";

import { Todo } from "@prisma/client";

import { useTodoStore } from "@/store/store";

import AppBar from "./appbar";
import ColumnKanban from "./column-kanban";
import ColumnList from "./column-list";
import SortingAndViewBar from "./sorting-view-bar";

export default function Columns() {
  const [sortBy, setSortBy] = useState("default");
  const [filterBy, setFilterBy] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState(false);

  const { numsOfTodo, numsOfInProgress, numsOfCompleted } = useTodoStore();
  const todos = useTodoStore((state) => state.todos);

  const numsOfTodoCount = numsOfTodo();
  const InProgressCount = numsOfInProgress();
  const CompletedCount = numsOfCompleted();

  console.log("todos2", todos);

  const filteredTasks = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch = todo.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPriority = filterBy === "all" || todo.priority === filterBy;
      if (filterBy === "high-priority") return todo.priority === "High";
      if (filterBy === "medium-priority") return todo.priority === "Medium";
      if (filterBy === "low-priority") return todo.priority === "Low";
      return matchesSearch && matchesPriority && filterBy === "all";
    });
  }, [todos, filterBy, searchQuery]);

  const sortedAndFilteredTodos = useMemo(() => {
    const sortedTodos = [...filteredTasks].sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === "upcoming-task") {
        return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
      }
      if (sortBy === "latest-task") {
        return new Date(b.dueDate!).getTime() - new Date(a.dueDate!).getTime();
      }
      return 0;
    });
    return sortedTodos;
  }, [filteredTasks, sortBy]);

  const todosForTodoColumn = sortedAndFilteredTodos.filter(
    (todo) => todo.status === "ToDo",
  );
  const todosForInProgressColumn = sortedAndFilteredTodos.filter(
    (todo) => todo.status === "InProgress",
  );
  const todosForCompletedColumn = sortedAndFilteredTodos.filter(
    (todo) => todo.status === "Completed",
  );

  const viewModeFunction = () => {
    setViewMode((prev) => !prev);
  };

  const viewProps = {
    todosForTodoColumn,
    numsOfTodoCount,
    todosForInProgressColumn,
    InProgressCount,
    todosForCompletedColumn,
    CompletedCount,
  };

  return (
    <div>
      <main className="space-y-4">
        <div className="space-y-4">
          <AppBar setSearchQuery={setSearchQuery} />
          <SortingAndViewBar
            viewModeFunction={viewModeFunction}
            viewMode={viewMode}
            setSortBy={setSortBy}
            setFilterBy={setFilterBy}
          />
        </div>
        <section className="h-full">
          {viewMode ? (
            <ListViewComponent {...viewProps} />
          ) : (
            <KanbanViewComponent {...viewProps} />
          )}
        </section>
      </main>
    </div>
  );
}

type ViewComponentProps = {
  todosForTodoColumn: Todo[];
  numsOfTodoCount: void;
  todosForInProgressColumn: Todo[];
  InProgressCount: void;
  todosForCompletedColumn: Todo[];
  CompletedCount: void;
};

function ListViewComponent({
  todosForTodoColumn,
  numsOfTodoCount,
  todosForInProgressColumn,
  InProgressCount,
  todosForCompletedColumn,
  CompletedCount,
}: ViewComponentProps) {
  return (
    <div className="">
      <ColumnList
        sortedAndFilteredTodos={todosForTodoColumn}
        title="Todo"
        status="ToDo"
        nums={numsOfTodoCount ?? 0}
      />
      <ColumnList
        sortedAndFilteredTodos={todosForInProgressColumn}
        title="In Progress"
        status="InProgress"
        nums={InProgressCount ?? 0}
      />
      <ColumnList
        sortedAndFilteredTodos={todosForCompletedColumn}
        title="Done"
        status="Completed"
        nums={CompletedCount ?? 0}
      />
    </div>
  );
}

function KanbanViewComponent({
  todosForTodoColumn,
  numsOfTodoCount,
  todosForInProgressColumn,
  InProgressCount,
  todosForCompletedColumn,
  CompletedCount,
}: ViewComponentProps) {
  return (
    <div className="flex w-full gap-4 lg:gap-12">
      <ColumnKanban
        sortedAndFilteredTodos={todosForTodoColumn}
        title="Todo"
        status="ToDo"
        nums={numsOfTodoCount ?? 0}
      />
      <ColumnKanban
        sortedAndFilteredTodos={todosForInProgressColumn}
        title="In Progress"
        status="InProgress"
        nums={InProgressCount ?? 0}
      />
      <ColumnKanban
        sortedAndFilteredTodos={todosForCompletedColumn}
        title="Done"
        status="Completed"
        nums={CompletedCount ?? 0}
      />
    </div>
  );
}
