import { v4 as uuidv4 } from "uuid";
import { IProject, Project, ProjectStatus, UserRole } from "./class/Project";
import { ProjectsManager } from "./class/ProjectsManager";
import { IToDo, TasktStatus, ToDo } from "./class/ToDo";
import { ToDosManager } from "./class/ToDosManager";

// Toggle Modal Function
function toggleModal(id: string, show: boolean) {
	const modal = document.getElementById(id);
	if (modal && modal instanceof HTMLDialogElement) {
		show ? modal.showModal() : modal.close();
	} else {
		console.warn(`Modal not found. ID: ${id}`);
	}
}

// Display Error Message Function
function displayErrorMessage(id: string, message: string) {
	const errorContainer = document.getElementById("error-container");
	const popupErrMsg = document.getElementById(id) as HTMLDialogElement;

	if (errorContainer) {
		errorContainer.textContent = message;
		if (popupErrMsg) {
			popupErrMsg.style.display = "block";
			popupErrMsg.showModal();
		} else {
			console.warn("Popup element not found");
		}
	} else {
		console.warn("Error container not found");
	}
}

// Constants for UI Elements
const projectsListUI = document.getElementById("projects-list") as HTMLElement;
const todosListUI = document.getElementById("todos-list") as HTMLElement;
const projectsManager = new ProjectsManager(projectsListUI);
const todoManager = new ToDosManager(todosListUI);

// Project List Button Event Listener
const projectBtn = document.getElementById("project-btn");
projectBtn?.addEventListener("click", () => {
	const projectsPage = document.getElementById("projects-page");
	const detailsPage = document.getElementById("project-details");
	if (projectsPage && detailsPage) {
		projectsPage.style.display = "flex";
		detailsPage.style.display = "none";
		console.log("Project List Page Loaded");
	}
});

// Edit Project Button Event Listener
const btnEditProject = document.getElementById("btn-edit-project");
btnEditProject?.addEventListener("click", () => {
	console.log("Edit Project Form Loaded");
	const project = projectsManager.getCurrentProj() as Project;
	const formTitle = editProjectForm?.querySelector("[form-info='form-title']");
	if (formTitle) formTitle.textContent = "Edit " + project.name;

	const finishDate = project?.finishDate ? new Date(project.finishDate).toISOString().split('T')[0] : '';
	toggleModal("edit-project-modal", true);
	if (editProjectForm) {
		editProjectForm["editid"].value = project.id;
		editProjectForm["editname"].value = project.name;
		editProjectForm["description"].value = project.description;
		editProjectForm["userRole"].value = project.userRole;
		editProjectForm["status"].value = project.status;
		editProjectForm["finishDate"].value = finishDate;
		editProjectForm["cost"].value = project.cost;
		editProjectForm["progress"].value = project.progress;
		editProjectForm["backcolor"].value = project.backColor;
	}
});

// Edit Project Form Event Listener
const editProjectForm = document.getElementById("edit-project-form") as HTMLFormElement;
editProjectForm?.addEventListener("submit", (e) => {
	e.preventDefault();
	const formData = new FormData(editProjectForm);
	const finishDateValue = formData.get("finishDate") as string;
	const finishDate = finishDateValue ? new Date(finishDateValue) : new Date();
	const progress = Number(formData.get("progress"));
	if (progress < 0 || progress > 100) {
		displayErrorMessage("err-popup", `Progress value should be between 0 - 100.`);
		editProjectForm["progress"].value = progress;
		return;
	}

	const projectData: IProject = {
		id: formData.get("editid") as string,
		name: formData.get("editname") as string,
		description: formData.get("description") as string,
		userRole: formData.get("userRole") as UserRole,
		status: formData.get("status") as ProjectStatus,
		finishDate,
		cost: Number(formData.get("cost")),
		progress,
		backColor: formData.get("backcolor") as string,
		lastUpdate: new Date(),
	};

	projectsManager.deleteProject(projectData.id);
	projectsManager.updateProject(projectData);

	try {
		projectsManager.updateProjectDetails(projectData);
		console.log("Project Information Updated Successfully!");
		toggleModal("edit-project-modal", false);
	} catch (err) {
		console.error("Error updating project:", err);
	}
});

// New To-Do Button Event Listener
const newTodoBtn = document.getElementById("add-todo-btn");
newTodoBtn?.addEventListener("click", (e) => {
	e.preventDefault();
	console.log("New ToDo Task Form Loaded");
	toggleModal("new-todo-modal", true);
});

// New Project Button Event Listener
const newProjectBtn = document.getElementById("btn-new-project");
const randomColor = () => {
	const colors = ["#42f54e", "#177a29", "#2f3d7f", "#946a26", "#8236a3", "#ad3e31"];
	const randomIndex = Math.floor(Math.random() * 6);
	return colors[randomIndex];
};
newProjectBtn?.addEventListener("click", (e) => {
	e.preventDefault();
	console.log("New Project Form Loaded");
	toggleModal("new-project-modal", true);
});

// New Project Cancel Button Event Listener
const newCancelBtn = document.getElementById("cancelbutton");
newCancelBtn?.addEventListener("click", () => {
	console.log("New Project Creation Cancelled");
	toggleModal("new-project-modal", false);
});

// Edit Project Cancel Button Event Listener
const editCancelBtn = document.getElementById("editcancelbutton");
editCancelBtn?.addEventListener("click", () => {
	toggleModal("edit-project-modal", false);
	console.log("Project Edition Cancelled");
});

// New To-Do Cancel Button Event Listener
const todoCancelBtn = document.getElementById("todocancelbutton");
todoCancelBtn?.addEventListener("click", () => {
	toggleModal("new-todo-modal", false);
	console.log("New ToDo Task Addition Cancelled");
});

// Edit To-Do Cancel Button Event Listener
const editToDoCancelBtn = document.getElementById("edittodocancelbutton");
editToDoCancelBtn?.addEventListener("click", () => {
	toggleModal("edit-todo-modal", false);
	console.log("ToDo Task Edition Cancelled");
});

// Close Popup Error Messages Button
const closePopupBtn = document.getElementById("close-popup-btn");
const popupErrMsg = document.getElementById("err-popup");
closePopupBtn?.addEventListener("click", () => {
	if (popupErrMsg) {
		toggleModal("err-popup", false);
		popupErrMsg.style.display = "none";
	} else {
		console.warn("Popup element not found");
	}
});

// New Project Form Event Listener
const projectForm = document.getElementById("new-project-form") as HTMLFormElement;
projectForm?.addEventListener("submit", (e) => {
	e.preventDefault();
	const formData = new FormData(projectForm);
	const finishDateValue = formData.get("finishDate") as string;
	const finishDate = finishDateValue ? new Date(finishDateValue) : new Date();

	const projectData: IProject = {
		id: uuidv4(),
		name: formData.get("name") as string,
		description: formData.get("description") as string,
		userRole: formData.get("userRole") as UserRole,
		status: formData.get("status") as ProjectStatus,
		finishDate,
		cost: 1800,
		progress: 25,
		backColor: randomColor(),
		lastUpdate: new Date(),
	};

	try {
		projectsManager.newProject(projectData);
		projectForm.reset();
		toggleModal("new-project-modal", false);
		console.log("Project created successfully!");
	} catch (err) {
		const name = formData.get("name") as string;
		if (name.length < 5) {
			displayErrorMessage("err-popup", `The project name must be at least 5 letters long.`);
		} else {
			displayErrorMessage("err-popup", `A project with the name '${name}' already exists.`);
		}
	}
});

// New To-Do Form Event Listener
const todoForm = document.getElementById("new-todo-form") as HTMLFormElement;
todoForm?.addEventListener("submit", (e) => {
	e.preventDefault();
	const formData = new FormData(todoForm);
	const finishDateValue = formData.get("todo-finishDate") as string;
	const finishDate = finishDateValue ? new Date(finishDateValue) : new Date();

	const todoData: IToDo = {
		description: formData.get("todo-description") as string,
		userRole: formData.get("todo-userRole") as UserRole,
		status: formData.get("todo-status") as TasktStatus,
		finishDate,
	};

	try {
		todoManager.newToDo(todoData);
		toggleModal("new-todo-modal", false);
		console.log("ToDo task created successfully!");
		todoForm.reset();
	} catch (err) {
		const description = formData.get("todo-description") as string;
		if (description.length === 0) {
			displayErrorMessage("err-popup", `To-Do Description must not be empty`);
		}
	}
});

// Edit To-Do Form Event Listener
const editToDoForm = document.getElementById("edit-todo-form") as HTMLFormElement;
editToDoForm?.addEventListener("submit", (e) => {
	e.preventDefault();
	const formData = new FormData(editToDoForm);
	const finishDateValue = formData.get("edit-todo-finishDate") as string;
	const finishDate = finishDateValue ? new Date(finishDateValue) : new Date();

	const id = formData.get("edit-todoid") as string;
	const todoData: IToDo = {
		description: formData.get("edit-todo-description") as string,
		userRole: formData.get("edit-todo-userRole") as UserRole,
		status: formData.get("edit-todo-status") as TasktStatus,
		finishDate,
	};

	try {
		todoManager.newToDo(todoData);
		toggleModal("edit-todo-modal", false);
		console.log("ToDo task updated successfully!");
		todoManager.deleteTodo(id);
		editToDoForm.reset();
	} catch (err) {
		const description = formData.get("edit-todo-description") as string;
		if (description.length === 0) {
			displayErrorMessage("err-popup", `To-Do Description must not be empty`);
		}
	}
});

// Export Projects and ToDos Button
const exportProjectBtn = document.getElementById("export-projects-btn");
exportProjectBtn?.addEventListener("click", (e) => {
	e.preventDefault();
	const plist = projectsManager.projList;
	const tlist = todoManager.todoList;
	const lst = [plist, tlist];
	const fileName = "Combined Export";
	const json = JSON.stringify(lst, null, 2);
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = fileName;
	a.click();
	URL.revokeObjectURL(url);
});

// Import Projects Button
const importProjectsBtn = document.getElementById("import-projects-btn");
importProjectsBtn?.addEventListener("click", (e) => {
	e.preventDefault();
	projectsManager.importFromJSON();
});
