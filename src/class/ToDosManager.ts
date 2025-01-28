//------------------FILE TO USED TO MANAGE TODOS----------------------//
import { UUIDTypes } from "uuid";
import { IToDo, ToDo} from "./ToDo";
import { UserRole } from "./Project";

// CREATE CLASS TODOS MANAGER
export class ToDosManager {
	todoList: ToDo[] = []
  ui: HTMLElement
  id: UUIDTypes
	incremental: string

	// CLASS TODOS MANAGER CONSTRUCTOR
	constructor(container: HTMLElement) {
		this.ui = container
		this.newToDo({
			description: "Sample todo Description" as string,
			finishDate:  new Date(),
			status: "Not Started",
			userRole: "Developer",
		})
		console.log("td class")
		
	}
//------------------------------------NEW TODO METHOD	
	newToDo(data: IToDo) {
		const todo = new ToDo(data)
		console.log(this.ui)
		this.ui.append(todo.ui)
    this.todoList.push(todo)
    return todo
		//this.setToDoContainer(todo)
	}

	private setToDoContainer (todo: ToDo) {
		const todoContainer = document.getElementById("todo-card")
		if(!todoContainer) {return}
		const todoDescription = todoContainer.querySelector("[data-todo-info='todo-description']")
		if (todoDescription) {todoDescription.textContent = todo.description}
		const todoDate = todoContainer.querySelector("[data-todo-info='todo-date']")
		if (todoDate) {todoContainer.textContent = new Date(todo.finishDate).toDateString().split(' ').slice(1, 3).join(' ')}
		console.log(todoDate, todoDescription, "from set todo")
	}
}

		
		