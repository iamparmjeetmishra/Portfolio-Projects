import { BtnActions } from "@/lib/types";

import { Button } from "./ui/button";

type TodoFormBtnProps = {
  actionType: BtnActions;
};

export default function TodoFormBtn({ actionType }: TodoFormBtnProps) {
  return (
    <Button type="submit">
      {actionType === "add" ? "Add Todo" : "Edit todo"}
    </Button>
  );
}
