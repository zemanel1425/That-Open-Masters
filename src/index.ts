//THE PURPOSE OF THIS FILE IS TO INTERACT WITH THE DOM AND TO HANDLE EVENTS//
//-------see reference file M2 L3.1--------//
//-------creating a git comment--------//
import { IProject, Project, ProjectStatus, UserRole } from "./class/Project"
import { ProjectsManager } from "./class/ProjectsManager"

/* Toggle Modal Function Definition
//----------------------------------------------------------------------------//
Takes html modal element id and alternates between visible and close
	sets const modal to html reference from html by id
	if modal is present and is an html dialog instance
		if show property is true
		in case both previous statments are truthy then invoke showModal function
		in case show property is false invoke close function
	in case either modal is not present or not an html dialog
	log a message in the console
end logic
//----------------------------------------------------------------------------//
*/
function toggleModal(id: string, show: boolean) {
	const modal = document.getElementById(id)
	if (modal && modal instanceof HTMLDialogElement) {
		if (show) {
			modal.showModal()
		} else {
			modal.close()
		}
	} else {
		console.warn("modal not found. ID: ", id)
	}
}
/* toggleModal lesson secrets
/// - const is a key word for ts variables
///		variables store reusable information
///		no space in const name instead use camelCase
/// - hardcode is the process of setting the argument value
///		inside the function; to avoid hardcode set parameter as id 
/// - this will be used for to do modal
/// - anonymous functions ()=>{} are not stored thus can't be reused
*/

//displayErrorMessage function
//receive a message, place it in the modal, and show the modal. 
function displayErrorMessage(id: string, message: string) {
	const errorContainer = document.getElementById("error-container")
	const popupErrMsg = document.getElementById(id) as HTMLDialogElement
	if (errorContainer) {
		errorContainer.textContent = message
		if (popupErrMsg) {
			popupErrMsg.style.display = "block"
			popupErrMsg.showModal()
		} else {
			console.warn("Popup element not found");
		}
	} else {
		console.warn("Error container not found")
	}
}

/* const projectsListUI
//--------------------------------------------------------------//
const projectsmanager gets the reference to html document
*/
const projectsListUI = document.getElementById("projects-list") as HTMLElement
/* const projectsListUI lesson secrests
/// - the const get the value of projects-list in html and is used
///		as the input for the argument in const projectsmanager
/// -	use type assertion to prevent errors for simplicity.
///		if else flow control it would be also possible
*/

/* const projectManager
//--------------------------------------------------------------//
const projectsmanager creates a new projectmanager instance
*/
const projectsManager = new ProjectsManager(projectsListUI)
/* const projectsManager lesson secrests
*/

/* Project Page Button Event listener
//--------------------------------------------------------------//
//--------------------------------------------------------------//
*/
const projectBtn = document.getElementById("project-btn")
if (projectBtn) {
	projectBtn.addEventListener("click", () => {
		const projectsPage = document.getElementById("projects-page")
		const detailsPage = document.getElementById("project-details")
		if (!projectsPage || !detailsPage) {return}
		projectsPage.style.display = "flex"
		detailsPage.style.display = "none"
	})
} else {
	console.warn("Project button not found")
}

/* New Project Button Event Listener
//--------------------------------------------------------------//
sets const newProjectBtn gets button reference from html by hardcode
if new newProjectBtn thruty
	add event click
	run callback anonymous function toggleModal
	in case newProjectBtn is falsy
	log warn in console
end logic
//--------------------------------------------------------------//
*/
const newProjectBtn = document.getElementById("btn-new-project")
if (newProjectBtn) {
	newProjectBtn.addEventListener("click", () => {
		toggleModal("new-project-modal", true)
	})
} else {
	console.warn("no button found")
}
/* newProjectBtn lesson secrets
/// - HTML need to get this file referenced to load, before body tag closes type attribute: 
///		<script src="./src/index.ts"></script>
///			</body> 
/// - if else statement is called here a flow control ///
/// - adding () in the call back function override the eventlistener ///
///   to avoid it enclose an anonymous function inside callback function ///
*/

/* const cancelBtn
//--------------------------------------------------------------//
const cancelBtn gets reference from html file
if flow control true
	run addeventlistenner method click invoke anonymous function
		togglemodal funciton sets to false
		if flow control true
		set popuprrmsg to no visibility
			else
			log warn in console
		end else
	end addeventlistener
	else
	log warn in console
end logic
//--------------------------------------------------------------//
*/
const cancelBtn = document.getElementById("cancelbutton")
if (cancelBtn) {	
	cancelBtn.addEventListener("click", () => {
		toggleModal("new-project-modal", false)
		if (popupErrMsg) {
			popupErrMsg.style.display = "none"
		} else {
			console.warn("Popup element not found")
		}
	})
} else {
	console.warn("no button found")
}
/* const projectsManager lesson secrests
///	-	buttons need type assignmente in html file to prevent
///		submit event event by default. see reference file M2 L3.6
*/

const closePopupBtn = document.getElementById("close-popup-btn")
const popupErrMsg = document.getElementById("err-popup")
if (closePopupBtn) {
	closePopupBtn.addEventListener("click", () => {
		if (popupErrMsg) {
			toggleModal("err-popup",false)
			popupErrMsg.style.display = "none"

		} else {
			console.warn("Popup element not found")
		}
	})
} else {
	console.warn("no button found")
}

/* projectForm event listener
//-------------------------------------------------------------------------------------------//
sets const projectForm to form reference from html by hardcode
	if projectForm is present and is an html form instance
		add event submit
		run callback anonymous function to prevent default action
			sets const formData to a new instance of FormData class with projectForm as argument
			sets const projectData to the data array below and ensure IProject data type
				gets	name formData from projectData and ensure IProject data type
							description
							status
							userRole
							finishDate
			end data collection
		try
			sets const project the result value of newproject method invoked with projecdata
			run reset method to clean up the form after submit
			run togglemodal function to close form ui
			log project new project data in console
			define catch
				define displayerrormessage function
					define errorcontainer reference html file
					if else flow control
			define const name
			run display error message function
			define popuperrmsg as reference to html
			if else flow control			
	log warn in console
end logic
//-------------------------------------------------------------------------------------------//
*/
const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement) {
	projectForm.addEventListener("submit", (e) => {
		e.preventDefault()
		const formData = new FormData(projectForm)
		const finishDateValue = formData.get("finishDate") as string
		const finishDate = finishDateValue ? new Date(finishDateValue) : new Date()
		const projectData: IProject = {
			name: formData.get("name") as string,
			description: formData.get("description") as string,
			status: formData.get("status") as ProjectStatus,
			userRole: formData.get("userRole") as UserRole,
			finishDate: finishDate
		}

		try {
			const project = projectsManager.newProject(projectData)
			projectForm.reset()
			toggleModal("new-project-modal", false)
			console.log(project)
		} catch (err) {
			const name = formData.get("name") as string
			if (name.length < 5) {
				displayErrorMessage("err-popup", `The project name must be at least 5 letters long.`)
			}
			else {
				displayErrorMessage("err-popup", `A project with the name '${name}' already exists.`)
			}
		}
	})
} else {
	console.warn("the form does not exist: ", projectForm)
}
/* projectForm event lesson secrets
/// - many events have default action, for form is submit and reload page
///		add (e) argument to callback function to prevent default
///	-	classes are object templates and are written in PascalCase 
// 		FormData is a built-in class that provides a set of key/value pairs  
/// - type assertion use 'as' keyword to assign data types
///		use to minimum necessry
/// - try catch statement is kind of a if else flow control statement
///		any line that gives an error inside try stops its execution and
///		any line inside catch is executed
/// - catch gives access to error message
*/

const exportProjectBtn = document.getElementById("export-projects-btn")
if (exportProjectBtn) {
	exportProjectBtn.addEventListener("click", () => {
		projectsManager.exportToJSON()
	})
}

const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
	importProjectsBtn.addEventListener("click", () => {
		projectsManager.importFromJSON()
	})
}

