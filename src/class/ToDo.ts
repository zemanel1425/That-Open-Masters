// --------- PURPOSE OF THIS FILE: TO STORE THE TODO CLASS --------- //

import { v4 as uuidv4 } from "uuid";
import { UserRole } from "./Project";

// CREATE CUSTOM DATA TYPES
export type TasktStatus = "Not Started" | "In Progress" | "Completed";

// CREATE INTERFACE IToDo
export interface IToDo {
  description: string;
  finishDate: Date;
  status: TasktStatus;
  userRole: UserRole;
}

// CREATE CLASS ToDo
export class ToDo implements IToDo {
  // To satisfy the interface
  description: string;
  status: TasktStatus;
  userRole: UserRole;
  finishDate: Date;

  // Class internals
  id: string;
  ui: HTMLDivElement;

  // CREATE CLASS CONSTRUCTOR
  constructor(data: IToDo) {
    this.id = uuidv4();
    this.status = "Not Started"; // Default status
    Object.assign(this, data); // Assign data to the instance
    this.setUi(); // Initialize the UI for the todo
  }

  // CREATE METHOD TO SET THE UI
  private setUi() {
    if (this.description.length <= 0) return; // Check for empty description

    // Format the finish date (e.g., 'Dec 26')
    const formattedDate = this.finishDate
      .toDateString()
      .split(' ')
      .slice(1, 3)
      .join(' ');

    // Create the UI for the todo item
    this.ui = document.createElement("div");
    this.ui.className = "todo-card";
    this.ui.innerHTML = `
      <p data-todo-info="todo-date" class="todo-token-date">${formattedDate}</p>
      <p data-todo-info="todo-description" class="todo-token-description">${this.description}</p>
      <p data-todo-info="todo-status" class="todo-token-status" style="display: none">${this.status}</p>
      <p data-todo-info="todo-id" class="todo-token-id" style="display: none">${this.id}</p>
    `;
  }
}
