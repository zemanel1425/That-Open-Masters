//---------THE PURPOSE OF THIS FILE IS TO INTERACT WITH THE DOM AND TO HANDLE EVENTS----------//
import { IProject, Project, ProjectStatus, UserRole } from "./class/Project"
import { ProjectsManager } from "./class/ProjectsManager"
import { IToDo,TasktStatus, ToDo } from "./class/ToDo"
import { ToDosManager } from "./class/ToDosManager"

// TOGGLE MODAL FUNCTION
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
// CONSTANT TODOSLISTUI
const todosListUI = document.getElementById("todos-list")	as HTMLElement
// CONSTANT PROJECTSMANAGER
const projectsManager = new ProjectsManager(projectsListUI)
// CONSTANT TODOSMANAGER
const todoManager = new ToDosManager(todosListUI)

// -------------------------------------------PROJECTS LIST BUTTON EVENT LISTENER
const projectBtn = document.getElementById("project-btn")
if (projectBtn) {
	projectBtn.addEventListener("click", () => {
		const projectsPage = document.getElementById("projects-page")
		const detailsPage = document.getElementById("project-details")
		if (!detailsPage) {return}
		if (projectsPage) {
			projectsPage.style.display = "flex"
		} 
		detailsPage.style.display = "none"		
		console.log("Project List Page Loaded")
	})
} else {
	console.warn("Project button not found")
}

// EDIT PROJECT BUTTON EVENT LISTENER
const btnEditProject = document.getElementById("btn-edit-project")
if (btnEditProject) {
	btnEditProject.addEventListener("click", () => {
		console.log("Edit Project Form Loaded")
		const project = projectsManager.getCurrentProj() as Project
		const formTitle = editProjectForm?.querySelector("[form-info ='form-title']")
		if (formTitle) {formTitle.textContent = "Edit " + project.name}
		const finishDate = project?.finishDate ? new Date(project.finishDate).toISOString().split('T')[0] : ''
		toggleModal("edit-project-modal", true)
		if (editProjectForm)
			{
				editProjectForm["name"].value = project.name
				editProjectForm["editid"].value = project.id
				editProjectForm["backcolor"].value = project.backColor
				editProjectForm["description"].value = project.description
				editProjectForm["status"].value = project.status			
				editProjectForm["userRole"].value = project.userRole
				editProjectForm["finishDate"].value = finishDate
				editProjectForm["cost"].value = project.cost
				editProjectForm["progress"].value = project.progress
			}
		})
	} else {
		console.warn("no button found")
	}
	
	
	// EDIT PROJECT FORM EVENT LISTENER
	const editProjectForm = document.getElementById("edit-project-form")
	if (editProjectForm && editProjectForm instanceof HTMLFormElement) {
		editProjectForm.addEventListener("submit", (e) => {
			e.preventDefault()
			const formData = new FormData(editProjectForm)
			const finishDateValue = formData.get("finishDate") as string
			const finishDate = finishDateValue ? new Date(finishDateValue) : new Date()
			const progress = Number(formData.get("progress"))
			if (progress) {
				if (progress < 0 || progress > 100) {
					displayErrorMessage("err-popup", `Progress value should be between 0 - 100.`)
					editProjectForm["progress"].value = progress
					return
				}
			}
			const projectData: Project = {
				name: formData.get("name") as string,
				description: formData.get("description") as string,
				status: formData.get("status") as ProjectStatus,
				userRole: formData.get("userRole") as UserRole,
				finishDate: finishDate,
				id: formData.get("editid") as string,
				cost: Number(formData.get("cost")),
				progress: progress,
				backColor: formData.get("backcolor") as string,
				nameInitials:'',
				todos: todosListUI,
				lastUpdate: new Date()
				//ui: projCard as HTMLDivElement,
				//setUi: () => { editProject }
			}
			projectsManager.deleteProject(projectData.id)
			try {
				projectsManager.updateProjectDetails(projectData)
				projectsManager.updateProject(projectData)
				console.log("Project Information Updated Successfuly!")
				toggleModal("edit-project-modal", false)
			} catch (err) {
				console.log("this is the error", err)
			}
		})
	} else {
		console.warn("no button found")
	}

//----------------------NEW TODO BUTTON EVENT LISTENER----------------------//
const newTodoBtn = document.getElementById("add-todo-btn")
if (newTodoBtn) {
	newTodoBtn.addEventListener("click", (e) => {
		e.preventDefault()
		console.log("New ToDo Task Form Loaded")
		toggleModal("new-todo-modal", true)
	})
}

// NEW PROJECT BUTTON EVENT LISTENER
const newProjectBtn = document.getElementById("btn-new-project")

function randomColor() {
	const colors = ["#42f54e", "#177a29", "#2f3d7f", "#946a26", "#8236a3", "#ad3e31"];
	const randomIndex = Math.floor(Math.random() * 5);
	return colors[randomIndex];
}

if (newProjectBtn) {
	newProjectBtn.addEventListener("click", (e) => {
		e.preventDefault()
		if(!newProjectBtn) { return }
		console.log("New Project Form Loaded")
		toggleModal("new-project-modal", true)
	})
} else {
	console.warn("no button found")
}

// NEW PROJECT CANCEL BUTTON EVENT LISTENER
const newCancelBtn = document.getElementById("cancelbutton")
if (newCancelBtn) {	
	newCancelBtn.addEventListener("click", () => {
		console.log("New Project Creation Cancelled")
		toggleModal("new-project-modal", false)
	})
} else {
	console.warn("no button found")
}

// EDIT PROJECT CANCEL BUTTON EVENT LISTENER
const editCancelBtn = document.getElementById("editcancelbutton")
if (editCancelBtn) {	
	editCancelBtn.addEventListener("click", () => {
		toggleModal("edit-project-modal", false)
		console.log("Project Edition Cancelled")
	})
} else {
	console.warn("no button found")
}

// NEW TODO CANCEL BUTTON EVENT LISTENER
const todoCancelBtn = document.getElementById("todocancelbutton")
if (todoCancelBtn) {	
	todoCancelBtn.addEventListener("click", () => {
		toggleModal("new-todo-modal", false)
		console.log("New ToDo Task Addition Cancelled")
	})
} else {
	console.warn("no button found")
}

// EDIT TODO CANCEL BUTTON EVENT LISTENER
const editToDoCancelBtn = document.getElementById("edittodocancelbutton")
if (editToDoCancelBtn) {	
	editToDoCancelBtn.addEventListener("click", () => {
		toggleModal("edit-todo-modal", false)
		console.log("ToDo Task Edition Cancelled")
	})
} else {
	console.warn("no button found")
}

// CLOSE POP UP ERROR MESSAGES BUTTON
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
			finishDate: finishDate,
			backColor: randomColor(),
			lastUpdate: new Date ()
		}
		try {
			projectsManager.newProject(projectData)
			projectForm.reset()
			toggleModal("new-project-modal", false)
			console.log("Project created Successfully!")
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

// --------------------------NEW TODO FORM EVENT LISTENER
const todoForm = document.getElementById("new-todo-form")
if (todoForm && todoForm instanceof HTMLFormElement) {	
	todoForm.addEventListener("submit", (e) => {
		e.preventDefault()
		const formData = new FormData(todoForm)
		const finishDateValue = formData.get("todo-finishDate") as string
		const finishDate = (finishDateValue ? new Date(finishDateValue) : new Date())
		const todoData: IToDo = {
			description: formData.get("todo-description") as string,
			userRole: formData.get("todo-userRole") as UserRole,
			status: formData.get("todo-status") as TasktStatus,
			finishDate: finishDate,
		}
		todoManager.newToDo(todoData)
		toggleModal("new-todo-modal", false)
		console.log("ToDo task created Successfully!")
		todoForm.reset()
	})
} else {
	console.warn("the form does not exist: ", projectForm)
}


// --------------------------EDIT TODO FORM EVENT LISTENER
const editToDoForm = document.getElementById("edit-todo-form")
if (editToDoForm && editToDoForm instanceof HTMLFormElement) {	
	editToDoForm.addEventListener("submit", (e) => {
		e.preventDefault()
		const formData = new FormData(editToDoForm)
		const finishDateValue = formData.get("edit-todo-finishDate") as string
		const finishDate = (finishDateValue ? new Date(finishDateValue) : new Date())
		const id = formData.get("edit-todoid") as string
		const todoData: IToDo = {
			description: formData.get("edit-todo-description") as string,
			userRole: formData.get("edit-todo-userRole") as UserRole,
			status: formData.get("edit-todo-status") as TasktStatus,
			finishDate: finishDate,
		}
		todoManager.newToDo(todoData)
		toggleModal("edit-todo-modal", false)
		//console.log("ToDo task created Successfully!")
		todoManager.deleteTodo(id)
		editToDoForm.reset()
	})
} else {
	console.warn("the form does not exist: ", projectForm)
}

// EXPORT BUTTON (PROJECTS AND TODOS)
const exportProjectBtn = document.getElementById("export-projects-btn")
if (exportProjectBtn) {
	exportProjectBtn.addEventListener("click", (e) => {
		e.preventDefault
		const plist = projectsManager.projList
		const tlist = todoManager.todoList
		const lst = [plist,tlist]
			const fileName = "Combined Export"
			const json = JSON.stringify(lst, null, 2)
			const blob = new Blob([json], { type: 'application/json' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = fileName
			a.click()
			 URL.revokeObjectURL(url)		
		})
		}

// IMPORT PROJECTS BUTTON
const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
	importProjectsBtn.addEventListener("click", (e) => {
		e.preventDefault()
		projectsManager.importFromJSON()
	})


}
