//THE PURPOSE OF THIS FILE IS TO INTERACT WITH THE DOM AND TO HANDLE EVENTS//
//-------see reference file M2 L3.1--------//
//-------creating a git comment--------//
import { todo } from "node:test"
import { IProject, Project, ProjectStatus, UserRole } from "./class/Project"
import { ProjectsManager } from "./class/ProjectsManager"

//TOGGLE MODAL FUNCTION
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

// DISPLAY ERROR MESSAGE FUNCTION
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

// CONSTANT PROJECTSLISTUI
const projectsListUI = document.getElementById("projects-list") as HTMLElement

//CONSTANT PROJECTSMANAGER
const projectsManager = new ProjectsManager(projectsListUI)


//PROJECTS BUTTON EVENT LISTENER
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

//EDIT PROJECT BUTTON EVENT LISTENER
const btnEditProject = document.getElementById("btn-edit-project")
const editProjectForm = document.getElementById("edit-project-form")

if (btnEditProject) {
	btnEditProject.addEventListener("click", () => {
		console.log("Edit Project Form Loaded")
		const project = projectsManager.getCurrentProj()
		const formTitle = editProjectForm?.querySelector("[form-info ='form-title']")
		if (formTitle) {formTitle.textContent = "Edit " + project?.name + " Project"}
		console.log(project, project?.id)
		const finishDate = project?.finishDate ? new Date(project.finishDate).toISOString().split('T')[0] : ''
		toggleModal("edit-project-modal", true)
		if (editProjectForm)
		{
			editProjectForm["name"].value = project?.name
			editProjectForm["name"].disabled = true
			editProjectForm["description"].value = project?.description
			editProjectForm["status"].value = project?.status			
			editProjectForm["userRole"].value = project?.userRole
			editProjectForm["finishDate"].value = finishDate
		}		
	})
} else {
	console.warn("no button found")
}

// EDIT PROJECT FORM EVENT LISTENER
if (editProjectForm && editProjectForm instanceof HTMLFormElement) {
	editProjectForm.addEventListener("submit", (e) => {
		e.preventDefault()
	//const name = projectsManager.getCurrentProjName()
		const formData = new FormData(editProjectForm)
		const finishDateValue = formData.get("finishDate") as string
		const finishDate = finishDateValue ? new Date(finishDateValue) : new Date()
		const projectData: IProject = {
			name: formData.get("description") as string,
			description: formData.get("description") as string,
			status: formData.get("status") as ProjectStatus,
			userRole: formData.get("userRole") as UserRole,
			finishDate: finishDate
		}
		try {
			const project = projectsManager.updateProjectDetails(projectData)
			editProjectForm.reset()
			toggleModal("edit-project-modal", false)
			console.log(project)
		} catch (err) {
			console.log(projectData)
		}
	})
} else {
	console.warn("no button found")
}

function defDate () {
}

// New Project Button Event Listener
const newProjectBtn = document.getElementById("btn-new-project")
if (newProjectBtn) {
	newProjectBtn.addEventListener("click", () => {
		toggleModal("new-project-modal", true)
	})
} else {
	console.warn("no button found")
}

//* const cancelBtn
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

const editCancelBtn = document.getElementById("editcancelbutton")
if (editCancelBtn) {	
	editCancelBtn.addEventListener("click", () => {
		toggleModal("edit-project-modal", false)
		if (popupErrMsg) {
			popupErrMsg.style.display = "none"
		} else {
			console.warn("Popup element not found")
		}
	})
} else {
	console.warn("no button found")
}
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



// projectForm event listener
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
// projectForm event lesson secrets
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

