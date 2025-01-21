//-------THE PURPOSE OF THIS FILE IS TO STORE THE PROJECT CLASSES-------//
//----------------------see reference file M2 L3.1-----------------------//
import {v4 as uuidv4} from "uuid"

/* create custom data types
//----------------------------------------------------------------------------//
create data types using the keyword type
export custom data types to use within files
//----------------------------------------------------------------------------//
*/
export type ProjectStatus = "active" | "inactive" | "finished" 
export type UserRole = "architect" | "engineer" | "developer" 

/* create interface IProject
//----------------------------------------------------------------------------//
export interface IProject
	set	name property data type
			description
			status
			userrole
			finishdate
end logic
//----------------------------------------------------------------------------//
*/
export interface IProject {
  name: string 
  description: string
  status: ProjectStatus
  userRole: UserRole
  finishDate: Date
}
/* interface IProject lesson secrests
///	-	Interfaces in TypeScript define the structure of an object, specifying property
///		types and method signatures. it acts as a custom data type template.
///	-	I before interface name is a commonly used convention to name interfaces
///		also avoid confusion with possible class names
*/

function nameInitials(name: string) {  
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

/* create class project
//--------------------------------------------------------------------------------------//
exports class Project
	assign	name property to class and ensure IProject data type is implemented
					description
					status			assign specific data type
					userRole		assign specific data type
					finishDate	date data type
					ui					not defined in IProject
					cost				assign data type and set default value not defined in IProject
					progress		assign data type and set default value not defined in IProject
					id					not defined in IProject
//--------------------------------------------------------------------------------------//
*/
export class Project implements IProject {
  name: string
  description: string
  status: "active" | "inactive" | "finished"
  userRole: "architect" | "engineer" | "developer"
  finishDate: Date
  ui: HTMLDivElement 
  cost: number = 0
  progress: number = 0
  id: string
/* project class lesson secrets
/// - classes are project templates
///		class NameSyntax {}
///	-	export the object class so it can be used in other files
///	-	| symbol defines or
*/


/* create class project constructor
//-------------------------------------------------------------------------------------//
	create constructor and ensure data argument is same type as IProject
		run uuidv4 method and assign it to current object instance id class type
		loop through data array properties and store its values in const key
			assign data key value to current object instance properties via loop
		run method setui
logic end
//-------------------------------------------------------------------------------------//
*/
  constructor(data: IProject) {
    this.id = uuidv4()
    for (const key in data) {
      this[key] = data[key]
    }
    this.setUi()
  }
/* constructor class lesson secrets
/// - constructor is a built in method that is used to initialize the object
///		properties and perform any setup required for the instance. 
///	-	it is invoked only once at every instanciation, can take arguments,
///		in this case data from current object instance
/// - 'this' is a built in method that refers to the current object instance
*/

/* create class method setui
//---------------------------------------------------------------------------------------------//
	define setui name without arguments
		if the current object instance exist and is an instance of html return - meaning exit
		run createElement method and store value in current object instance ui property
		assign project-card class property and store valui in current object instance ui property
		define innerhtml and store valuies in current object instance ui property
		<>
			assign various properties to current object instance...
		<>
	logic end
//---------------------------------------------------------------------------------------------//
*/
  setUi () {
    if (this.ui && this.ui instanceof HTMLElement || this.name.length < 5) {return}

		function randomColor() {
			const randomIndex = Math.floor(Math.random() * 5);
			return colors[randomIndex];
		}
		
    this.ui = document.createElement("div") 
    this.ui.className = "project-card" 
    this.ui.innerHTML = `
    <div class="card-header">
      <p style= "width: 25px; display: flex; align-items: center; padding: 10px; border-radius: 8px; 
			aspect-ratio: 1; background-color: ${randomColor()}">${nameInitials(this.name)}</p>
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
        <p>${this.progress}</p>
      </div>
    </div>`
  }
/* setui lesson secrets
/// - setui does not need function preceeding key word
///	-	if statement is checking whether the element is already created,
///		if so then stops at return and does not execute further else continues
///		running. this ensures only one instance of project card is created
/// - to create multiple line strings inside innerhtml use ` (back ticks)
///	-	in this case we moved the project card div we have created earlier in html
///	-	insert data from the constructor dinamicaly using template literals/strings ${}
///		template literals only work with back ticks!
/// - && this.ui instanceof HTMLElement is important to 
*/
}
