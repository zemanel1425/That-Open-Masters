//------------------FILE TO USED TO MANAGE TODOS----------------------//
import { UUIDTypes } from "uuid";
import { IToDo, ToDo} from "./ToDo";
import { UserRole } from "./Project";

// CREATE CLASS TODOS MANAGER
export class ToDosManager {
	todoList: ToDo[] = []
  ui: HTMLElement
  id: UUIDTypes
	incremental: string

	// CLASS TODOS MANAGER CONSTRUCTOR
	constructor(container: HTMLElement) {
		this.ui = container
		this.newToDo({
			description: "Sample todo Description" as string,
			finishDate:  new Date(),
			status: "Not Started",
			userRole: "Developer",
		})		
	}

// UPDATE TODO METHOD
	updateToDo (data:IToDo) {

	}

//-----------------------------CREATE NEW TODO METHOD	
	newToDo(data: IToDo) {
		const todo = new ToDo(data)
		todo.ui.addEventListener("click", () => {
			const todoCard = document.getElementById("todo-card")
			if (todoCard) {
				todoCard.style.display = "block"
			}
		})
		this.ui.append(todo.ui)
    this.todoList.push(todo)
    this.changeColorByStatus()
	}
	
	//-----------------------------EDIT TODO METHOD	


	// GET CURRENT TODO LIST
	getTodosList (){
		const todosList = document.getElementById("todos-list")
		return todosList
	}

	// DELETE TODO LIST
		deleteTodoList () {
		const todosList = document.getElementById("todos-list")
		if(todosList) {
			const childDivs = todosList.querySelectorAll('div')
			childDivs.forEach(div => div.remove())
			} else {
				console.log('Parent div not found')
				}
	}

	// EXPORT TODOS AS JSON METHOD
	exportToJSON(fileName: string = "todos") {
		const json = JSON.stringify(this.todoList, null, 2)
		const blob = new Blob([json], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = fileName
		a.click()
		URL.revokeObjectURL(url)
	}

	// CHANGE TODO COLOR STATUS
	changeColorByStatus() {
		const todoCards = document.querySelectorAll('.todo-card');
		todoCards.forEach(card => {
				const statusElement = card.querySelector('.todo-token-status');
				const status = statusElement && statusElement.textContent ? statusElement.textContent.trim().toLowerCase() : '';
				const dateElement = card.querySelector('.todo-token-date');
				if (dateElement)
				if (status === 'not started') {
						(dateElement as HTMLElement).style.backgroundColor = 'red';
				} else if (status === 'in progress') {
						(dateElement as HTMLElement).style.backgroundColor = 'orange';
				} else {
						(dateElement as HTMLElement).style.backgroundColor = 'green';
				}
				card.addEventListener('click', (event) => {
					const id = card.querySelector('.todo-token-id')?.textContent || '';
					console.log(`this card id: ${id}`);
					if (id) {
						const todo = this.getTodoById(id);
						const finishDate = todo?.finishDate ? new Date(todo.finishDate).toISOString().split('T')[0] : ''
						const todoModal = document.getElementById("edit-todo-modal");
						const todoForm = document.getElementById("edit-todo-form")
						if (todoModal && todoModal instanceof HTMLDialogElement) {
							todoModal.showModal();
							if (todoForm) {
								if (todo) {
									todoForm["edit-todo-description"].value = todo.description;
									todoForm["edit-todo-userRole"].value = todo.userRole;
									todoForm["edit-todo-status"].value = todo.status;
									todoForm["edit-todo-finishDate"].value = finishDate;
									todoForm["edit-todoid"].value = todo.id;
								}
							}
						}
					}
				});
			});
		}

		getTodoById(id:string) {
			const todo = this.todoList.find((todo) => {
				return todo.id === id
			})
			return todo
		}
		
		// DELETE PROJECT METHOD
		deleteTodo(id: string) {
			const todo = this.getTodoById(id)
			if (!todo) { return }
			todo.ui.remove()
			const remaining = this.todoList.filter((todo) => {
				return todo.id !== id
			})
			this.todoList = remaining
		}

}
