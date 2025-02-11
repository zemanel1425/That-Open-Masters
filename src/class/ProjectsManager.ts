import { IProject, Project } from "./Project";

// Class to manage projects
export class ProjectsManager {
  projList: Project[] = [];
  ui: HTMLElement;

  constructor(container: HTMLElement) {
    this.ui = container;
    this.newProject({
			id: "SampleProjectId",
      name: "Sample Project",
      description: "Sample Project Description",
      status: "Active",
      userRole: "Developer",
      finishDate: new Date(),
			cost: 2500,
			progress: 30,
      backColor: "orange",
      lastUpdate: new Date(),
    });
  }

  // Method to update project details on the details page
  updateProjectDetails(project: IProject): void {
    const detailsPage = document.getElementById("project-details");
    if (!detailsPage) return;

    const updateElement = (selector: string, value: string) => {
      const element = detailsPage?.querySelector(selector);
      if (element) element.textContent = value;
    };

    updateElement("[data-project-info='name']", project.name);
    updateElement("[data-project-info='description']", project.description);
    updateElement("[data-project-info='card-description']", project.description);
    updateElement("[data-project-info='card-status']", project.status);
    updateElement("[data-project-info='card-role']", project.userRole);
    updateElement("[data-project-info='card-date']", new Date(project.finishDate).toDateString());
    updateElement("[data-project-info='card-cost']", `$${project.cost}`);
    updateElement("[data-project-info='card-completion']", `${project.progress}%`);

    const cardProgressBar = document.getElementById("progress-bar");
    if (cardProgressBar) cardProgressBar.style.width = `${project.progress}%`;
  }

  // Method to add a new project
  updateProject(data: IProject): Project {
    const project = new Project(data);
    project.ui.addEventListener("click", () => this.showProjectDetails(project));
    this.ui.append(project.ui);
    this.projList.push(project);
    return project;
  }

  // Method to create a new project and ensure no duplicate project names
  newProject(data: IProject): Project {
    if (this.projList.some((project) => project.name === data.name)) {
      throw new Error(`A project with the name '${data.name}' already exists`);
    }
    return this.updateProject(data);
  }

  // Method to display the details of a selected project
  private setDetailsPage(project: Project): void {
    const detailsPage = document.getElementById("project-details");
    if (!detailsPage) return;

    const updateElement = (selector: string, value: string | number) => {
      const element = detailsPage?.querySelector(selector);
      if (element) element.textContent = value.toString();
    };

    updateElement("[data-project-info='name']", project.name);
    updateElement("[data-project-info='description']", project.description);
    updateElement("[data-project-info='card-name']", project.name);
    updateElement("[data-project-info='card-description']", project.description);
    updateElement("[data-project-info='card-status']", project.status);
    updateElement("[data-project-info='card-cost']", `$${project.cost}`);
    updateElement("[data-project-info='card-completion']", `${project.progress}%`);
    updateElement("[data-project-info='card-role']", project.userRole);
    updateElement("[data-project-info='card-date']", new Date(project.finishDate).toDateString());

    const cardInitials = detailsPage.querySelector("[data-project-info='card-initials']");
    if (cardInitials) {
      cardInitials.textContent = project.nameInitials;
      (cardInitials as HTMLElement).style.background = project.backColor;
    }

    const cardProgressBar = document.getElementById("progress-bar");
    if (cardProgressBar) cardProgressBar.style.width = `${project.progress}%`;
  }

  // Display project details page
  private showProjectDetails(project: Project): void {
    const projectsPage = document.getElementById("projects-page");
    const detailsPage = document.getElementById("project-details");

    if (!projectsPage || !detailsPage) return;

    projectsPage.style.display = "none";
    detailsPage.style.display = "flex";
    this.setDetailsPage(project);
  }

  // Get project by ID
  getProject(id: string): Project | undefined {
    return this.projList.find((project) => project.id === id);
  }

  // Get project by name
  getProjectByName(name: string): Project | undefined {
    return this.projList.find((project) => project.name === name);
  }

  // Get the currently viewed project
  getCurrentProj(): Project | undefined {
    const detailsPage = document.getElementById("project-details");
    if (!detailsPage) return;

    const name = detailsPage.querySelector("[data-project-info='name']");
    return this.projList.find((project) => project.name === name?.textContent);
  }

  // Calculate the total cost of all projects
  calculateTotalCost(): number {
    return this.projList.reduce((acc, project) => acc + project.cost, 0);
  }

  // Delete a project by ID
  deleteProject(id: string): void {
    const project = this.getProject(id);
    if (!project) return;

    project.ui.remove();
    this.projList = this.projList.filter((project) => project.id !== id);
  }

  // Export projects to a JSON file
  exportToJSON(fileName: string = "projects"): void {
    const json = JSON.stringify(this.projList, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Import projects from a JSON file
  importFromJSON(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    const reader = new FileReader();
    const importSummary: string[] = [];

    reader.addEventListener("load", () => {
      const json = reader.result;
      if (!json) return;

      const projects: Project[] = JSON.parse(json as string);
      for (const project of projects) {
        try {
          this.newProject(project);
          importSummary.push(`${project.name} Imported Successfully!`);
        } catch (err) {
          const existingProject = this.getProjectByName(project.name);
          if (existingProject && new Date(project.lastUpdate) > new Date(existingProject.lastUpdate)) {
            this.deleteProject(existingProject.id);
            this.updateProject(project);
            importSummary.push(`${project.name} Updated Successfully!`);
          } else {
            importSummary.push(`${project.name} Import was ignored!`);
          }
        }
      }

      this.popupInfoMsg(this.importJSONLog(importSummary));
    });

    input.addEventListener('change', () => {
      const filesList = input.files;
      if (filesList) reader.readAsText(filesList[0]);
    });

    input.click();
  }

  // Display an information message
  popupInfoMsg(message: string): void {
    const errorContainer = document.getElementById("error-container") as HTMLParagraphElement;
    const warnMsgModal = document.getElementById("err-popup") as HTMLDialogElement;

    if (errorContainer && warnMsgModal) {
      errorContainer.innerHTML = message;
      warnMsgModal.style.display = "block";
      warnMsgModal.showModal();
    }
  }

  // Log the import summary
  importJSONLog(summary: string[]): string {
    return summary.join("<br>\n");
  }
}
