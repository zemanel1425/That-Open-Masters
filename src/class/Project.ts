//-------THE PURPOSE OF THIS FILE IS TO STORE THE PROJECT CLASSES-------//
//----------------------see reference file M2 L3.1-----------------------//
import {v4 as uuidv4} from "uuid"

//CREATE CUSTOM DATA TYPES
export type ProjectStatus = "Active" | "inactive" | "Finished" 
export type UserRole = "Architect" | "Engineer" | "Developer"

const todos = document.getElementById("todos-list")

//CREATE INTERFACE IPROJECT
export interface IProject {
  name: string 
  description: string
  status: ProjectStatus
  userRole: UserRole
  finishDate: Date
	backColor: string
}

function nameInitials(name: string) {  
	const words = name.match(/\b\w+\b/g) || []
  let initials: string
  if (words.length > 1) {
    initials = words.slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('')
  } else {
    initials = words[0] ? words[0].slice(0, 2).toUpperCase() : ''
  }
  return initials
}

const todosElement = document.getElementById("todos-list")

// CREATE CLASS PROJECT
export class Project implements IProject {
// to satisfy interface
  name: string
  description: string
  status: "Active" | "inactive" | "Finished"
  userRole: "Architect" | "Engineer" | "Developer"
  finishDate: Date
	backColor: string

// class internals
  ui: HTMLDivElement 
  cost: number
  progress: number
  id: string
	nameInitials: string
	todos: HTMLElement

// CREATE CLASS PROJECT CONSTRUCTOR
  constructor(data: IProject) {
    this.id = uuidv4()
		this.cost = 2500
		this.progress = 30
    if (todosElement) {
      this.todos = todosElement as HTMLElement
    } else {
      throw new Error("Element with id 'todos-list' not found")
    }
    for (const key in data) {
      this[key] = data[key]
    }
    this.setUi()
  }

// CREATE CLASS PROJECT METHOD SET UI
  setUi () {
    if (this.ui && this.ui instanceof HTMLElement || this.name.length < 5) {return}
		this.nameInitials = nameInitials(this.name)
		this.backColor = this.backColor
    this.ui = document.createElement("div") 
    this.ui.className = "project-card" 
    this.ui.innerHTML = `
    <div class="card-header">
      <p style= "display: flex; align-items: center; padding: 8px; border-radius: 100%;	font-size: 20px;
			 font-weight: bold; aspect-ratio: 1; background-color: ${this.backColor}">${this.nameInitials}</p>
      <div>
        <h5>${this.name}</h5>
        <p>${this.description}</p>
      </div>
    </div>
    <div class="card-content">
      <div class="card-property">
        <p style="color: #969696;">Status</p>
        <p>${this.status}</p>
      </div>
      <div class="card-property">
        <p style="color: #969696;">Role</p>
        <p>${this.userRole}</p>
      </div>
      <div class="card-property">
        <p style="color: #969696;">Cost</p>
        <p>$${this.cost}</p>
      </div>
      <div class="card-property">
        <p style="color: #969696;">Estimated Progress</p>
        <p>${this.progress}%</p>
			`
  }
}
