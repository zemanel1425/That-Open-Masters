//THE PURPOSE OF THIS FILE IS TO INTERACT WITH THE DOM AND TO HANDLE EVENTS//
//-------see reference file M2 L3.1--------//
//-------creating a git comment--------//
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
		const project = projectsManager.getCurrentProj() as Project
		const formTitle = editProjectForm?.querySelector("[form-info ='form-title']")
		if (formTitle) {formTitle.textContent = "Edit " + project.name + " Project"}
		const finishDate = project?.finishDate ? new Date(project.finishDate).toISOString().split('T')[0] : ''
		toggleModal("edit-project-modal", true)
		if (editProjectForm)
			{
				editProjectForm["name"].value = project.name
				editProjectForm["id"].value = project.id
				editProjectForm["description"].value = project.description
				editProjectForm["status"].value = project.status			
				editProjectForm["userRole"].value = project.userRole
				editProjectForm["finishDate"].value = finishDate
				editProjectForm["cost"].value = project.cost
				editProjectForm["progress"].value = project.progress
			}	
			console.log(project, "at the end of the edit project button event listener")
	})
} else {
	console.warn("no button found")
}

// EDIT PROJECT FORM EVENT LISTENER
if (editProjectForm && editProjectForm instanceof HTMLFormElement) {
	editProjectForm.addEventListener("submit", (e) => {
		e.preventDefault()
		const formData = new FormData(editProjectForm)
		const finishDateValue = formData.get("finishDate") as string
		const finishDate = finishDateValue ? new Date(finishDateValue) : new Date()
		const projectData: Project = {
			name: formData.get("name") as string,
			description: formData.get("description") as string,
			status: formData.get("status") as ProjectStatus,
			userRole: formData.get("userRole") as UserRole,
			finishDate: finishDate,
			id: formData.get("id") as string,
			cost: Number(formData.get("cost")),
			progress: Number(formData.get("progress")),
		}
		projectsManager.deleteProject(projectData.id)
		try {
			projectsManager.updateProjectDetails(projectData)
			const project = projectsManager.updateProject(projectData)
			toggleModal("edit-project-modal", false)
			console.log(project)
		} catch (err) {
			console.log("this is the error", err)
		}
	})
} else {
	console.warn("no button found")
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

// NEW PROJECT FORM EVENT LISTENER
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

