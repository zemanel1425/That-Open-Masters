// ---------------------------- FILE TO MANAGE TODOS ---------------------------- //
import { UUIDTypes } from "uuid";
import { IToDo, ToDo } from "./ToDo";

// CREATE CLASS TODOS MANAGER
export class ToDosManager {
  todoList: ToDo[] = [];
  ui: HTMLElement;
  id: UUIDTypes;

  // CLASS TODOS MANAGER CONSTRUCTOR
  constructor(container: HTMLElement) {
    this.ui = container;
    this.newToDo({
			id: "SampleTodoId" as string,
      description: "Sample todo Description" as string,
      userRole: "Developer",
      status: "Not Started",
      finishDate: new Date(),
			projId: "SampleProjectId",
    });
  }
  
	// Method to clean todos list
	cleanToDoList() {
		const todosList = document.getElementById("todos-list");
		if (todosList) {
			const divs = todosList.querySelectorAll("div");
			divs.forEach((child) => {
				todosList.removeChild(child);
			});
		}
	}
	
	cleanToDoUi(id: string) {
		// const todosList = document.getElementById("todos-list");
		const todo = this.getTodoById(id);
		if (todo) {
			todo.ui.remove();
		}
	}
	
	// Method to update a new todo
	updateToDo(data: IToDo) {
		// const todo = new ToDo(data);
		// if (!todo) return;
		// this.ui.replaceChildren(todo.ui);

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
		this.editToDo()
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
		})
		}

  // ---------------------------- EDIT TODO METHOD ---------------------------- //
  editToDo() {
    const todoCards = document.querySelectorAll(".todo-card");
    todoCards.forEach((card) => {
      card.addEventListener("click", (e) => {
				e.preventDefault();
        const id = card.querySelector(".todo-token-id")?.textContent || "";
        if (id) {
          const newTodo = this.getTodoById(id);
					this.cleanToDoUi(id);
          if (card) {
					}
          const finishDate = newTodo?.finishDate
					? new Date(newTodo.finishDate).toISOString().split("T")[0]
					: "";
          const todoModal = document.getElementById("edit-todo-modal");
          const todoForm = document.getElementById("edit-todo-form");
					
          if (todoModal && todoModal instanceof HTMLDialogElement) {
						todoModal.showModal();
            if (todoForm) {
							console.log("Edit To-Do Form Loaded")
              if (newTodo) {
								todoForm["edit-todoid"].value = id
                todoForm["edit-todo-description"].value = newTodo.description;
                todoForm["edit-todo-userRole"].value = newTodo.userRole;
                todoForm["edit-todo-status"].value = newTodo.status;
                todoForm["edit-todo-finishDate"].value = finishDate;
                todoForm["edit-todoid"].value = newTodo.id;
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
