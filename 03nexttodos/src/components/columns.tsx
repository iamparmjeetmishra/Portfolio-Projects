import { useTodoStore } from "@/store/store";

import Column from "./column";

export default function Columns() {
  const { numsOfTodo, numsOfInProgress, numsOfCompleted } = useTodoStore();

  const numsOfTodoCount = numsOfTodo();
  const InProgressCount = numsOfInProgress();
  const CompletedCount = numsOfCompleted();

  return (
    <div>
      <section className="flex gap-4 lg:gap-12">
        <Column title="Todo" status="ToDo" nums={numsOfTodoCount ?? 0} />
        <Column
          title="In Progress"
          status="InProgress"
          nums={InProgressCount ?? 0}
        />
        <Column title="Done" status="Completed" nums={CompletedCount ?? 0} />
      </section>
    </div>
  );
}
