import { IToDo } from "./ToDo";
// Custom data types
export type ProjectStatus = "Active" | "Inactive" | "Finished";
export type UserRole = "Architect" | "Engineer" | "Developer";

// Interface for Project
export interface IProject {
	id: string;
	name: string;
	description: string;
	userRole: UserRole;
	status: ProjectStatus;
	finishDate: Date;
	cost: number;
	progress: number;
  backColor: string;
  lastUpdate: Date;
	todos: IToDo[];
}

// Utility function to get name initials
function nameInitials(name: string): string {
  const words = name.match(/\b\w+\b/g) || [];
  return words.length > 1
    ? words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('')
    : words[0] ? words[0].slice(0, 2).toUpperCase() : '';
}

// Class for Project
export class Project implements IProject {
  id: string;
  name: string;
  description: string;
  userRole: UserRole;
  status: ProjectStatus;
  finishDate: Date;
  cost: number;
  progress: number;
  backColor: string;
  lastUpdate: Date;
  todos: IToDo[];
  ui: HTMLDivElement;
  nameInitials: string;

  constructor(data: IProject) {
    Object.assign(this, data); // Assigning all properties from the data to the class
    this.nameInitials = nameInitials(this.name);
    this.setUi();
  }

  // Set up the UI for the project card
  setUi(): void {
    if (this.ui && this.ui instanceof HTMLElement || this.name.length < 5) return;

    this.ui = document.createElement("div");
    this.ui.className = "project-card";
    this.ui.innerHTML = `
      <div class="card-header">
        <p style="display: flex; align-items: center; padding: 8px; border-radius: 100%; font-size: 20px;
        font-weight: bold; aspect-ratio: 1; background-color: ${this.backColor}">
          ${this.nameInitials}
        </p>
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
      </div>
    `;
  }
}
