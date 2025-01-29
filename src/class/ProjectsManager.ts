//------------------FILE TO USED TO MANAGE PROJECTS----------------------//
//---------------------see reference file M2 L3.1-------------------------//
import { UUIDTypes } from "uuid";
import { IProject, Project } from "./Project";

// CREATE CLASS PROJECTS MANAGER
export class ProjectsManager {
  projList: Project[] = []
  ui: HTMLElement
  id: UUIDTypes

// CLASS PROJECTS MANAGER CONSTRUCTOR
  constructor(container: HTMLElement) {
    this.ui = container
    this.newProject({
      name: "Sample Project" as string,
      description: "Sample Project Description" as string,
      status: "Active",
      userRole: "Developer",
      finishDate: new Date(),
			backColor: "#FFA500"
    })
  }
	
// UPDATE PROJECT DETAILS METHOD
		updateProjectDetails(project: Project) {
		const detailsPage = document.getElementById("project-details")
		const name = detailsPage?.querySelector("[data-project-info='name']")
		if (name) {name.textContent = project.name}
		const description = detailsPage?.querySelector("[data-project-info='description']")
		if (description) {description.textContent = project.description}
		const cardDescription = detailsPage?.querySelector("[data-project-info='card-description']")
		if (cardDescription) {cardDescription.textContent = project.description}
		const cardStatus = detailsPage?.querySelector("[data-project-info='card-status']")
		if (cardStatus) {cardStatus.textContent = project.status}
		const cardRole = detailsPage?.querySelector("[data-project-info='card-role']")
		if (cardRole) {cardRole.textContent = project.userRole}
		const cardDate = detailsPage?.querySelector("[data-project-info='card-date']")
  	if (cardDate) {cardDate.textContent = new Date (project.finishDate).toDateString()}
		const cardCost = detailsPage?.querySelector("[data-project-info='card-cost']")
		if (cardCost) {cardCost.textContent = "$" + project.cost.toString()}
		const cardProgress = detailsPage?.querySelector("[data-project-info='card-completion']")
		if (cardProgress) {cardProgress.textContent = project.progress.toString() + "%"}
		const cardProgressBar = document.getElementById("progress-bar")
		if (cardProgressBar) {cardProgressBar.style.width = project.progress.toString() + "%"}
	}

//UPDATE PROJECT METHOD
	updateProject (data:IProject) {
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
    this.projList.push(project)
    return project
	}

// CREATE NEW PROJECT METHOD
  newProject(data: IProject) {
    const projectNames = this.projList.map((project) => {
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
    this.projList.push(project)
    return project
  }

// SET PROJECT INFORMATION ON PROJECT CARD DETAILS PAGE
	private setDetailsPage(project: Project) {
		const detailsPage = document.getElementById("project-details")
		console.log("Project Details Page Loaded")
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
  if (cardCost) {cardCost.textContent = "$" + project.cost.toString()}
	const cardProgress = detailsPage.querySelector("[data-project-info='card-completion']")
  if (cardProgress) {cardProgress.textContent = project.progress.toString() + "%"}
	const cardProgressBar = document.getElementById("progress-bar")
	if (cardProgressBar) {cardProgressBar.style.width = project.progress.toString() + "%"}
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

// GetProject method
	getProject(id: string) {
		const project = this.projList.find((project) => {
			return project.id === id
		})
		return project
	}

	getProjectByName(name: string) {
		const project = this.projList.find((project) => {
			return project.name === name
		})
		return project
	}

  getCurrentProj() {
		const detailsPage = document.getElementById("project-details")
    if (!detailsPage) { return }
    const name = detailsPage.querySelector("[data-project-info='name']")
    const currentProject = this.projList.find((project) => {
      return project.name === name?.textContent
    })
    if (name && currentProject) { name.textContent = currentProject.name }
    return currentProject
  }

  calculateTotalCost() {
    const totalCost = this.projList.reduce(
      (acc, project) => {
        return acc + project.cost
      }, 0)
    return totalCost
  }

// DELETE PROJECT METHOD
  deleteProject(id: string) {
    const project = this.getProject(id)
    if (!project) { return }
    project.ui.remove()
    const remaining = this.projList.filter((project) => {
      return project.id !== id
    })
    this.projList = remaining
  }

	// EXPORT TO JSON METHOD
  exportToJSON(fileName: string = "projects") {
    const json = JSON.stringify(this.projList, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
   	URL.revokeObjectURL(url)
  }

// IMPORT FROM JSON METHOD
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
}