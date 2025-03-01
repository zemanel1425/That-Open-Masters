//---------THE PURPOSE OF THIS FILE IS TO INTERACT WITH THE DOM AND TO HANDLE EVENTS----------//
import { v4 as uuidv4 } from "uuid";
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { Sidebar } from "./react-components/Sidebar"
import * as THREE from "three"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js"
import { IProject, Project, ProjectStatus, UserRole } from "./class/Project";
import { ProjectsManager } from "./class/ProjectsManager";
import { IToDo, TasktStatus, ToDo } from "./class/ToDo";
import { ToDosManager } from "./class/ToDosManager";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
	<Sidebar />
)

// TOGGLE MODAL FUNCTION
function toggleModal(id: string, show: boolean) {
	const modal = document.getElementById(id);
	if (modal && modal instanceof HTMLDialogElement) {
		show ? modal.showModal() : modal.close();
	} else {
		console.warn(`Modal not found. ID: ${id}`);
	}
}

// DISPLAY ERROR MESSAGE FUNCTION
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

// CONSTANT PROJECTSLISTUI
const projectsListUI = document.getElementById("projects-list") as HTMLElement;
const todosListUI = document.getElementById("todos-list") as HTMLElement;
const projectsManager = new ProjectsManager(projectsListUI);
const todoManager = new ToDosManager(todosListUI);

// -------------------------------------------PROJECTS LIST BUTTON EVENT LISTENER
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

// EDIT PROJECT BUTTON EVENT LISTENER
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

	// EDIT PROJECT FORM EVENT LISTENER
const editProjectForm = document.getElementById("edit-project-form") as HTMLFormElement;
editProjectForm?.addEventListener("submit", (e) => {
	e.preventDefault();
	const formData = new FormData(editProjectForm);
	const finishDateValue = formData.get("finishDate") as string;
	const finishDate = finishDateValue ? new Date(finishDateValue) : new Date();
	const progress = Number(formData.get("progress"));
	const project = projectsManager.getCurrentProj();
	const todos = project?.todos as []

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
		todos: todos,
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

//----------------------NEW TODO BUTTON EVENT LISTENER----------------------//
const newTodoBtn = document.getElementById("add-todo-btn");
newTodoBtn?.addEventListener("click", (e) => {
	e.preventDefault();
	console.log("New ToDo Task Form Loaded");
	toggleModal("new-todo-modal", true);
});

// NEW PROJECT BUTTON EVENT LISTENER
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

// NEW PROJECT CANCEL BUTTON EVENT LISTENER
const newCancelBtn = document.getElementById("cancelbutton");
newCancelBtn?.addEventListener("click", () => {
	console.log("New Project Creation Cancelled");
	toggleModal("new-project-modal", false);
});

// EDIT PROJECT CANCEL BUTTON EVENT LISTENER
const editCancelBtn = document.getElementById("editcancelbutton");
editCancelBtn?.addEventListener("click", () => {
	toggleModal("edit-project-modal", false);
	console.log("Project Edition Cancelled");
});

// NEW TODO CANCEL BUTTON EVENT LISTENER
const todoCancelBtn = document.getElementById("todocancelbutton");
todoCancelBtn?.addEventListener("click", () => {
	const newToDoForm = document.getElementById("new-todo-form") as HTMLFormElement;
	newToDoForm.reset();
	toggleModal("new-todo-modal", false);
	console.log("New ToDo Task Addition Cancelled");
});

// Edit To-Do Cancel Button Event Listener
	const editToDoCancelBtn = document.getElementById("edittodocancelbutton");
	editToDoCancelBtn?.addEventListener("click", () => {
	const todoForm = document.getElementById("edit-todo-form") as HTMLFormElement;
	const formData = new FormData(editToDoForm);
	const id = formData.get("edit-todoid") as string;
	const newTodo = todoManager.getTodoById(id);
	if (newTodo) {
	if (todoForm) {
	console.log("Edit To-Do Form Loaded")
	todoForm["edit-todoid"].value = id
	todoForm["edit-todo-description"].value = newTodo.description;
	todoForm["edit-todo-userRole"].value = newTodo.userRole;
	todoForm["edit-todo-status"].value = newTodo.status;
	todoForm["edit-todo-finishDate"].value = new Date(newTodo.finishDate).toISOString().split('T')[0];
	todoForm["edit-todoid"].value = newTodo.id;
	}
	}
	console.log("ToDo Task Edition Cancelled");
	toggleModal("edit-todo-modal", false);
	console.log(newTodo)
	console.log(todoManager.todoList)
	editToDoForm.dispatchEvent(new Event("submit",));
	});

// CLOSE POP UP ERROR MESSAGES BUTTON
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

// NEW PROJECT FORM EVENT LISTENER
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
		todos: [],
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

// --------------------------NEW TODO FORM EVENT LISTENER
const todoForm = document.getElementById("new-todo-form") as HTMLFormElement;
todoForm?.addEventListener("submit", (e) => {
	e.preventDefault();
	const formData = new FormData(todoForm);
	const finishDateValue = formData.get("todo-finishDate") as string;
	const finishDate = finishDateValue ? new Date(finishDateValue) : new Date();
	const project = projectsManager.getCurrentProj()

	const todoData: IToDo = {
		id: uuidv4(),
		description: formData.get("todo-description") as string,
		userRole: formData.get("todo-userRole") as UserRole,
		status: formData.get("todo-status") as TasktStatus,
		finishDate,
		projId: project?.id || ''
	};

	try {
		todoManager.deleteTodo("SampleTodoId")
		todoManager.newToDo(todoData);
		project?.todos.push(todoData)
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

// --------------------------EDIT TODO FORM EVENT LISTENER
const editToDoForm = document.getElementById("edit-todo-form") as HTMLFormElement;
editToDoForm?.addEventListener("submit", (e) => {
	e.preventDefault();
	const formData = new FormData(editToDoForm);
	const finishDateValue = formData.get("edit-todo-finishDate") as string;
	const finishDate = finishDateValue ? new Date(finishDateValue) : new Date();
	const project = projectsManager.getCurrentProj();
	const id = formData.get("edit-todoid") as string;
	
	const todoData: IToDo = {
		id: uuidv4() as string,
		description: formData.get("edit-todo-description") as string,
		userRole: formData.get("edit-todo-userRole") as UserRole,
		status: formData.get("edit-todo-status") as TasktStatus,
		finishDate,
		projId: project?.id || ''
	};
	
	try {
		todoManager.deleteTodo(id)
		projectsManager.removeToDo(id)
		todoManager.newToDo(todoData);
		project?.todos.push(todoData)
		toggleModal("edit-todo-modal", false);
		console.log("ToDo task updated successfully!");
	} catch (err) {
		const description = formData.get("edit-todo-description") as string;
		if (description.length === 0) {
			displayErrorMessage("err-popup", `To-Do Description must not be empty`);
		}
	}
});

// EXPORT BUTTON (PROJECTS AND TODOS)
const exportProjectBtn = document.getElementById("export-projects-btn");
exportProjectBtn?.addEventListener("click", (e) => {
	e.preventDefault();
	const plist = projectsManager.projList;
	const tlist = todoManager.todoList;
	const lst = [plist,[tlist]];
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

// IMPORT PROJECTS BUTTON
const importProjectsBtn = document.getElementById("import-projects-btn");
importProjectsBtn?.addEventListener("click", (e) => {
	e.preventDefault();
	projectsManager.importFromJSON();
});

//ThreeJS viewer
const scene = new THREE.Scene()

//viewer container
const viewerContainer = document.getElementById("viewer-container") as HTMLElement
const camera = new THREE.PerspectiveCamera(75)
camera.position.z = 5
//renderer
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
viewerContainer.append(renderer.domElement)

function resizeViewer () {
	const containerDimensions = viewerContainer.getBoundingClientRect() //new dimensions of the viewer
	renderer.setSize(containerDimensions.width, containerDimensions.height) // resize renderer based on new viewer size
	const aspectRatio = containerDimensions.width/containerDimensions.height // new aspect ratio calculation
	camera.aspect = aspectRatio // new aspect ratio applied
	camera.updateProjectionMatrix() // update the camera computation. must be called after everychange so the mesh keeps proportions
}

window.addEventListener("resize", resizeViewer)

resizeViewer()

//mesh
const boxGeometry = new THREE.BoxGeometry()
const material = new THREE.MeshPhongMaterial()
const cube = new THREE.Mesh(boxGeometry, material)
//lights
const directionalLight = new THREE.DirectionalLight() // like sun light
const spotLight = new THREE.SpotLight()
const ambientLight = new THREE.AmbientLight() // indirect light
ambientLight.intensity = 1

// scene
scene.add(cube, directionalLight, ambientLight, spotLight)

const cameraControls = new OrbitControls(camera, viewerContainer)

function renderScene() {
	renderer.render(scene, camera)
	requestAnimationFrame(renderScene)	// requestAnimationFrame is a method of the object window!!!
}

renderScene()

// grid helper
const axes = new THREE.AxesHelper(5)
const grid = new THREE.GridHelper()
grid.material.transparent = true
grid.material.opacity = 0.4
grid.material.color = new THREE.Color("#808080")
scene.add(axes, grid)

// lightcontrols helper
// const helper = new THREE.SpotLightHelper(spotLight)
// scene.add(helper)
spotLight.lookAt(-1,20,-3);

// helpers display ui
const gui = new GUI()

// helpers folder
const cogControls = gui.addFolder("cog")
const cubeControls = gui.addFolder("cube")
const lightControls = gui.addFolder("lights")
cubeControls.add(cube.position, "x", -10, 10, 1)
cubeControls.add(cube.position, "y", -10, 10, 1)
cubeControls.add(cube.position, "z", -10, 10, 1)
cubeControls.add(cube, "visible")
cubeControls.addColor(cube.material, "color")
lightControls.add(directionalLight.position, "x", -50, 50, 0.2)
lightControls.add(directionalLight.position, "y", -50, 50, 0.2)
lightControls.add(directionalLight.position, "z", -50, 50, 0.2)
lightControls.add(directionalLight, "intensity", 0, 2, 0.1)
lightControls.addColor(directionalLight, "color")
lightControls.add(directionalLight, "visible")
lightControls.add(spotLight, 'intensity', 0, 10, 0.0001)
lightControls.add(spotLight, 'distance', 0, 10, 0.0001)
lightControls.add(spotLight, 'decay', 0, 4, 0.1)
lightControls.add(spotLight, 'angle', 0, 1, 0.1)
lightControls.add(spotLight, 'penumbra', 0, 1, 0.1)
lightControls.add(spotLight.position, 'x', -10, 10, 0.0001)
lightControls.add(spotLight.position, 'y', -10, 10, 0.0001)
lightControls.add(spotLight.position, 'z', -10, 10, 0.0001)
lightControls.add(spotLight, "visible")


// define obj mesh file and material file
const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()

// load obj mesh file
mtlLoader.load("../Assets/Gear/Gear1.mtl", (materials) => {
	materials.preload()
	objLoader.setMaterials(materials)
	objLoader.load("../Assets/Gear/Gear1.obj", (mesh) => {
		scene.add(mesh)
		mesh.scale.set(.25,.25,.25)
		cogControls.add(mesh.position, "x", -10, 10, .1)
		cogControls.add(mesh.position, "y", -10, 10, .1)
		cogControls.add(mesh.position, "z", -10, 10, .1)
		cogControls.add(mesh, 'visible')
	})
})
// define gltf mesh file
const gltfloader = new GLTFLoader

//load glft mesh file
gltfloader.load("../Assets/gltf/scene.gltf", (gltf) => {
	gltf.scene.scale.set(.005*gltf.scene.scale.x, .005*gltf.scene.scale.y, .005 * gltf.scene.scale.z)

	scene.add(gltf.scene)
	
	})