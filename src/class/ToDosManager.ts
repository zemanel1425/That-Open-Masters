// ---------------------------- FILE TO MANAGE TODOS ---------------------------- //
import { UUIDTypes } from "uuid";
import { IToDo, ToDo } from "./ToDo";

// CREATE CLASS TODOS MANAGER
export class ToDosManager {
  todoList: ToDo[] = [];
  ui: HTMLElement;
  id: UUIDTypes;
  incremental: string;

  // CLASS TODOS MANAGER CONSTRUCTOR
  constructor(container: HTMLElement) {
    this.ui = container;
    this.newToDo({
      description: "Sample todo Description" as string,
      finishDate: new Date(),
      status: "Not Started",
      userRole: "Developer",
    });
  }

  // ---------------------------- CREATE NEW TODO METHOD ---------------------------- //
  newToDo(data: IToDo) {
    const todo = new ToDo(data);
    todo.ui.addEventListener("click", () => {
      const todoCard = document.getElementById("todo-card");
      if (todoCard) {
        todoCard.style.display = "block";
      }
    });
    this.ui.append(todo.ui);
    this.todoList.push(todo);
    this.changeColorByStatus();
  }

  // ---------------------------- CHANGE TODO COLOR BASED ON STATUS ---------------------------- //
  changeColorByStatus() {
    const todoCards = document.querySelectorAll(".todo-card");
    todoCards.forEach((card) => {
      const statusElement = card.querySelector(".todo-token-status");
      const status =
        statusElement && statusElement.textContent
          ? statusElement.textContent.trim().toLowerCase()
          : "";
      const dateElement = card.querySelector(".todo-token-date");

      if (dateElement) {
        if (status === "not started") {
          (dateElement as HTMLElement).style.backgroundColor = "red";
        } else if (status === "in progress") {
          (dateElement as HTMLElement).style.backgroundColor = "orange";
        } else {
          (dateElement as HTMLElement).style.backgroundColor = "green";
        }
      }

      card.addEventListener("click", () => {
        const id = card.querySelector(".todo-token-id")?.textContent || "";
        if (id) {
          const todo = this.getTodoById(id);
          const finishDate = todo?.finishDate
            ? new Date(todo.finishDate).toISOString().split("T")[0]
            : "";
          const todoModal = document.getElementById("edit-todo-modal");
          const todoForm = document.getElementById("edit-todo-form");

          if (todoModal && todoModal instanceof HTMLDialogElement) {
            todoModal.showModal();
            if (todoForm) {
							console.log("Edit To-Do Form Loaded")
              if (todo) {
                todoForm["edit-todo-description"].value = todo.description;
                todoForm["edit-todo-userRole"].value = todo.userRole;
                todoForm["edit-todo-status"].value = todo.status;
                todoForm["edit-todo-finishDate"].value = finishDate;
                todoForm["edit-todoid"].value = todo.id;
              }
            }
          }
        }
      });
    });
  }

  // ---------------------------- GET TODO BY ID ---------------------------- //
  getTodoById(id: string) {
    return this.todoList.find((todo) => todo.id === id);
  }

  // ---------------------------- DELETE TODO METHOD ---------------------------- //
  deleteTodo(id: string) {
    const todo = this.getTodoById(id);
    if (!todo) return;

    todo.ui.remove();
    this.todoList = this.todoList.filter((todo) => todo.id !== id);
  }
}
