//------------------FILE TO USED TO MANAGE PROJECTS----------------------//
//---------------------see reference file M2 L3.1-------------------------//
import { UUIDTypes } from "uuid";
import { IProject, Project } from "./Project";

/* create class ProjectsManager
//----------------------------------------------------------------------------//
export class projectsmanager
	define list property as an array of data type class project
	define ui property with data type htmlelement
//----------------------------------------------------------------------------//
*/
export class ProjectsManager {
  list: Project[] = []
  ui: HTMLElement
  id: UUIDTypes
/* class projects manager lesson secrests
/// - master class for the whole applicaton to manage projects
///		create, delete, import, export, etc.
///	-	list is an array of project instances
///		will serve as a reference to all projects
///	-	ui is going to be the container for all project cards
*/

/* create class projectsmanager constructor
//-------------------------------------------------------------------------------------//
	create constructor and ensure argument is same data type as IProject
		assign the value of container to the current object instance property
		assign default values to the current object instance
//-------------------------------------------------------------------------------------//
*/
  constructor(container: HTMLElement) {
    this.ui = container
    this.newProject({
      name: "Default Name" as string,
      description: "Default Description" as string,
      status: "active",
      userRole: "developer",
      finishDate: new Date(),
    })
  }
/* projectsmanager constructor lesson secrests
/// - argument container would be projects-list in html file
*/

/* create class method newProject
//----------------------------------------------------------------------------//
define newproject method ensure argument is same data type as IProject 
	define const projectnames as a list of project names
		return a list of project names
	define const nameinuse using the includes method on projectnames
	if nameinuse is true
		throw a new error message
	else
	creates new project instance and stores its value in const project
	add event listener to card ui
		define const projectspage
		define const detailspage
		if flow control not one nor the other finish code
		else hide projects page
		show details page
	run append method and 
	run push method and store values in current object instance list property
	return the value of the methode 
//----------------------------------------------------------------------------//
*/
  newProject(data: IProject) {
    const projectNames = this.list.map((project) => {
      return project.name
    })
    const nameInUse = projectNames.includes(data.name)
    if (nameInUse) {
      throw new Error(`A project with the name '${data.name}' already exists`)
    }
    const project = new Project(data)
		project.ui.addEventListener("click", () => {
			const projectsPage = document.getElementById("projects-page")
			const detailsPage = document.getElementById("project-details")
			if (!projectsPage || !detailsPage) {return}
			projectsPage.style.display = "none"
			detailsPage.style.display = "flex"
			this.setDetailsPage(project)
		})
    this.ui.append(project.ui)
    this.list.push(project)
    return project
  }
/* newproject method lesson secrests
/// - list.map makes a new list based on the return values of the callback function
///	-	throw is a special keyword used to stop the execution when an error occurs
///	-	error is a built in class
/// - || or syntax 
*/

private setDetailsPage(project: Project) {
	const detailsPage = document.getElementById("project-details")
	if(!detailsPage) {return}
	const name = detailsPage.querySelector("[data-project-info='name']")
	if (name) {name.textContent = project.name}
	const description = detailsPage.querySelector("[data-project-info='description']")
	if (description) {description.textContent = project.description}
	const cardName = detailsPage.querySelector("[data-project-info='card-name']")
	if (cardName) {cardName.textContent = project.name}
	const cardDescription = detailsPage.querySelector("[data-project-info='card-description']")
	if (cardDescription) {cardDescription.textContent = project.description}
	const cardStatus = detailsPage.querySelector("[data-project-info='card-status']")
	if (cardStatus) {cardStatus.textContent = project.status}
	const cardCost = detailsPage.querySelector("[data-project-info='card-cost']")
  if (cardCost) {cardCost.textContent = project.cost.toString()}
	const cardRole = detailsPage.querySelector("[data-project-info='card-role']")
  if (cardRole) {cardRole.textContent = project.userRole}
	const cardDate = detailsPage.querySelector("[data-project-info='card-date']")
  if (cardDate) {cardDate.textContent = new Date (project.finishDate).toDateString()}
	const cardInitials = detailsPage.querySelector("[data-project-info='card-initials']")
	if (cardInitials) {
		cardInitials.textContent = project.nameInitials;
    (cardInitials as HTMLElement).style.background = project.backColor;
	}
  }

/* create getProject method
//-------------------------------------------------------------------------------------//
	create getProject and ensure argument is of data type string
		assign const project the result of run method find in current list 
			return the project id in current list using find method
		return const project value		
//-------------------------------------------------------------------------------------//
*/
  getProject(id: string) {
    const project = this.list.find((project) => {
      return project.id === id
    })
    return project
  }
/* getProject method lesson secrests
/// - find method iterate over the projects list and returns the project id if
///		matches the id provided in the argument.
/// - getproject id return the project with id or undifined if unmatched
*/

  getProjectByName(name: string) {
    const project = this.list.find((project) => {
      return project.name === name
    })
    return project
  }


  calculateTotalCost() {
    const totalCost = this.list.reduce(
      (acc, project) => {
        return acc + project.cost
      }, 0)
    return totalCost
  }

/* create deleteProject method
//-------------------------------------------------------------------------------------//
	create deleteProject and ensure argument is of data type string
		assign const project the result of getproject method
		if project not fund finish function
		else run remove method on project.ui
		define remaining const, run filter method on project list
			return projects id that are not equal to the result getproject
		end logic
		update list to remaining projects
	end logic
//-------------------------------------------------------------------------------------//
*/
  deleteProject(id: string) {
    const project = this.getProject(id)
    if (!project) { return }
    project.ui.remove()
    const remaining = this.list.filter((project) => {
      return project.id !== id
    })
    this.list = remaining
  }
/* deleteProject method lesson secrests
/// - the filter method is non destructive, meaning does not alter the list structure
///		this is known as immutability
*/

/* create exportToJSON method
//-------------------------------------------------------------------------------------//
	create exportToJSON and ensure argument is of data type string with default file name projects
		define const json const to contain converted data from current object
		define const blob to be a new blob container of array data of json type application
		define const url to contain a temporary url to download the blob
		define const a to be the creation of a ghost html document
		define href property for a to be the url
		define href property for a to be the filename
		define href property for a to be a button click
		clean up the url data		
	end logic
//-------------------------------------------------------------------------------------//
*/
  exportToJSON(fileName: string = "projects") {
    const json = JSON.stringify(this.list, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }
/* exportToJSON method lesson secrests
/// - JSON is a global object that converts js objects to and from json
/// - blob binary large object is a file-like object of immutable, raw data;
///		they can be read as text or binary data, or converted into a Readable
///		Stream so its methods can be used for processing the data
///	-	url is a global object that allow the creation of a temporary url to a
///		downloadable source
///	- a is not added to the page but rather is a ghost file to work with
*/

/* create importFromJSON method
//-------------------------------------------------------------------------------------//
	create importFromJSON
		define const input
		set input property type as file
		set input property accept as application json
		define reader as new file reader
		add event listener load to reader
			set json to be the result from reader at the end of the logic
			if flow control
			define projects as an array of iproject from run parse method on json
			iterate through the array projects
				set const name as project name
				try
					create a newproject
					catch error
						error management
						.
						.
		addeventlistener to input to be of change
			define filelist to be the content of input 
			if filelist null end execution
			else run readastext method on reader and set it as an array of filelist
	end logic
//-------------------------------------------------------------------------------------//
*/
  importFromJSON() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()
    reader.addEventListener("load", () => {
      const json = reader.result
      if (!json) { return }
      const projects: IProject[] = JSON.parse(json as string)
      for (const project of projects) {
        const name = project.name;
        try {
          this.newProject(project)
        } catch (err) {
          // Function to display error message
          function displayWarnMsg(message: string) {
            const errorContainer = document.getElementById("error-container");
            if (errorContainer) {
              errorContainer.textContent = message;
            } else {
              console.warn("Error container not found")
            }
          }
          displayWarnMsg(`There are projects with identical property "name" in the file you are importing.
            \n Projets with identical name may not be imported.
            Please open and review your file to prevent data loss.`);
          // Display error message
          const warnMsgModal = document.getElementById("err-popup") as HTMLDialogElement
          if (warnMsgModal) {
            warnMsgModal.style.display = "block"
            warnMsgModal.showModal()
          } else {
            console.warn("Popup element not found")
          }
        }
      }
    })	
    input.addEventListener('change', () => {
      const filesList = input.files
      if (!filesList) { return }
      reader.readAsText(filesList[0])
    })
    input.click()
  }
/* importFromJSON method lesson secrests
/// - input type file let select local files to use in app
/// - filereader stores the content of the file
///	-	fileslist array starts at index 0
///	-	the load event only happens after the change event is complete
///	-	parse method convert text to js objects
*/
}