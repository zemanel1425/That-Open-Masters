//-------THE PURPOSE OF THIS FILE IS TO STORE THE PROJECT CLASSES-------//
//----------------------see reference file M2 L3.1-----------------------//
import {v4 as uuidv4} from "uuid"
import {UserRole} from "./Project.ts"

//CREATE CUSTOM DATA TYPES
export type TasktStatus = "Not Started" | "In Progress" | "Completed" 

//CREATE INTERFACE ITODO
export interface IToDo {
	description: string
	finishDate: Date
	status: "Not Started" | "In Progress" | "Completed"
	userRole: UserRole
}

// CREATE CLASS TODO
export class ToDo implements IToDo { //!!!!!!!!use ToDo instead of Todo!!!!!!!
	// to satisfy interface
	
	description: string
	status: "Not Started" | "In Progress" | "Completed"
	userRole: UserRole
	finishDate: Date

	// class internals
  ui: HTMLDivElement 
  id: string
	incremental: string

// CREATE CLASS PROJECT CONSTRUCTOR
  constructor(data: IToDo) {
    this.id = uuidv4()
		this.status = "Not Started"
		const ui = document.getElementById("todo-card-container")
    for (const key in data) {
      this[key] = data[key]
    }
    this.setUi()
  }

// CREATE CLASS PROJECT METHOD SET UI
  setUi () {
    if (this.ui && this.ui instanceof HTMLElement || this.description.length < 0) {return}
		const d = this.finishDate.toDateString().split(' ').slice(1, 3).join(' ');
    this.ui = document.createElement("div") 
    this.ui.className = "todo-card"
    this.ui.innerHTML = `
			<p data-todo-info="todo-date" class="todo-token-date">${d}</p>
			<p data-todo-info="todo-description"	class="todo-token-description">${this.description}</p>
			<p data-todo-info="todo-status"	class="todo-token-status" style="display: none">${this.status}</p>`
  }
}
