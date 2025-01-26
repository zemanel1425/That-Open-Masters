//-------THE PURPOSE OF THIS FILE IS TO STORE THE PROJECT CLASSES-------//
//----------------------see reference file M2 L3.1-----------------------//
import {v4 as uuidv4} from "uuid"

//CREATE CUSTOM DATA TYPES
export type ProjectStatus = "Active" | "inactive" | "Finished" 
export type UserRole = "Architect" | "Engineer" | "Developer"

//CREATE INTERFACE IPROJECT
export interface IProject {
  name: string 
  description: string
  status: ProjectStatus
  userRole: UserRole
  finishDate: Date
}

export function nameInitials(name: string) {  
  const words = name.split(' ')
  let initials: string
  if (words.length > 1) {
    initials = words.slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('')
  } else {
    initials = words[0].slice(0, 2).toUpperCase()
  }
  return initials
}

const colors = ["#9f351d", "#177a29", "#2f3d7f", "#946a26", "#8236a3", "#ad3e31"];

// CREATE CLASS PROJECT
export class Project implements IProject {
  name: string
  description: string
  status: "Active" | "inactive" | "Finished"
  userRole: "Architect" | "Engineer" | "Developer"
  finishDate: Date
  ui: HTMLDivElement 
  cost: number
  progress: number
  id: string
	nameInitials: string
	backColor: string

// CREATE CLASS PROJECT CONSTRUCTOR
  constructor(data: IProject) {
    this.id = uuidv4()
		this.cost = 0
		this.progress = 0
    for (const key in data) {
      this[key] = data[key]
    }
    this.setUi()
  }

// CREATE CLASS PROJECT METHOD SET UI
  setUi () {
    if (this.ui && this.ui instanceof HTMLElement || this.name.length < 5) {return}

		function randomColor() {
			const randomIndex = Math.floor(Math.random() * 5);
			return colors[randomIndex];
		}
		this.nameInitials = nameInitials(this.name)
		this.backColor = randomColor()
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
      </div>
    </div>`
  }
}
