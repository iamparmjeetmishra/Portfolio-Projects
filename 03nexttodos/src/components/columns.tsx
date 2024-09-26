import Column from "./column";

export default function Columns() {
  return (
    <div>
      <section className="flex gap-4 lg:gap-12">
        <Column title="Todo" status="ToDo" />
        <Column title="In Progress" status="InProgress" />
        <Column title="Done" status="Completed" />
      </section>
    </div>
  );
}
