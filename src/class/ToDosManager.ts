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
	}
//------------------------------------NEW TODO METHOD	
	newToDo(data: IToDo) {
		const todo = new ToDo(data)
		this.ui.append(todo.ui)
    this.todoList.push(todo)
    return todo
	}

	// GET CURRENT TODO LIST
	getTodosList (){
		const todosList = document.getElementById("todos-list")
		return todosList
	// DELETE TODO LIST
	}
	
	deleteTodoList () {
		const todosList = document.getElementById("todos-list")
		if(todosList) {
			const childDivs = todosList.querySelectorAll('div')
			childDivs.forEach(div => div.remove())
			} else {
				console.log('Parent div not found')
				}
	}

	// EXPORT TODOS AS JSON METHOD
	exportToJSON(fileName: string = "todos") {
		const json = JSON.stringify(this.todoList, null, 2)
		const blob = new Blob([json], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = fileName
		a.click()
		URL.revokeObjectURL(url)
	}

	// CHANGE TODO COLOR STATUS
	changeColorByStatus(){
		
	}
}