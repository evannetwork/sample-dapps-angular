/*
  Copyright (c) 2018-present evan GmbH.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
      http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

/*
  Copyright (c) 2018-present evan GmbH.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
      http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import {
	Component, ChangeDetectorRef, OnInit  // @angular/core
} from 'angular-libs';

import {
	EvanRoutingService,
	EvanDescriptionService,
	EvanCoreService,
	EvanQueue,
	EvanTranslationService,
	AsyncComponent
} from 'angular-core';

import {
	TaskService
} from '../../services/task';

/**************************************************************************************************/

@Component({
	selector: 'todo-app',
	templateUrl: './app.html'
})
export class TodoApp extends AsyncComponent {
	newTodoText = '';
	
	public contractId: string;
	public description: any;
	public invalid: boolean;
	public loading: boolean;
	public todos: Array<any>;
	public todoLogs: Array<any>;
	public queueWatchTodos: Function;
	private queueId: any;

	constructor(
		public ref: ChangeDetectorRef,
		private routingService: EvanRoutingService,
		private descriptionService: EvanDescriptionService,
		private coreService: EvanCoreService,
		private queue: EvanQueue,
		private taskService: TaskService,
		private translationService: EvanTranslationService
	) {
		super(ref);
	}

	async _ngOnInit() {
		this.contractId = this.routingService.getHashParam('address');

		if (this.contractId.indexOf('0x') !== 0) {
			this.invalid = true;
		} else {
			this.loading = true;
			this.ref.detectChanges();

			// load contract description and todos
			this.description = await this.descriptionService.getDescription(this.contractId);
			this.queueId = this.taskService.getListEntryQueueID(this.contractId);

			// set translation for dapp-wrapper title (contract-id => contract title)
			this.translationService.addSingleTranslation(this.contractId, this.description.name);

			// add a queue watcher for the current contract and the creation of new list entries
			this.queueWatchTodos = await this.queue.onQueueFinish(this.queueId, async () => {
				this.todos = await this.getListEntries('todos');
				this.todoLogs = (await this.getListEntries('todologs')).map(todoLog => todoLog.id);
				
				this.checkTodosFinished();
				this.ref.detectChanges();
			});

			this.loading = false;
		}
	}

	/**
	 * Load the todos for the current selected contract
	 */
	async getListEntries(listName: string) {
		return await this.taskService.getDataContract().getListEntries(
			this.contractId,
			listName,
			this.coreService.activeAccount()
		);
	}

	/**
	 * Set completed flag on todos.
	 */
	checkTodosFinished() {
		this.todoLogs.forEach(todoLog => {
			for (let todo of this.todos) {
				if (todo.id === todoLog) {
					todo.completed = true;;
				}
			}
		});
	}

	/**
	 * Creates a new Todo with the current newTodoText
	 */
	addTodo() {
		if (this.newTodoText.trim().length) {
			// create todo data including a id, so we can identify it later
			const todoData: any = {
				id: this.coreService.utils.generateID(),
				title: this.newTodoText,
			};

			// save the todo using the queue
			this.queue.addQueueData(this.queueId, {
				taskId: this.contractId,
				data: todoData,
				listName: 'todos',
			});

			// add it already to the list and display it loading
			const todoCopy = JSON.parse(JSON.stringify(todoData));
			todoCopy.loading = true;
			this.todos.push(todoCopy);

			this.newTodoText = '';
		}

		this.ref.detectChanges();
	}

	/**
	 * Adds an todo log and save the todo as solved.
	 * @param todo todo to solve
	 */
	async solveTodo(todo: any) {
		if (!todo.completed) {
			todo.loading = true;
			todo.completed = true;
	
			// save the todo using the queue
			this.queue.addQueueData(this.queueId, {
				taskId: this.contractId,
				listName: 'todologs',
				data: {
					id: todo.id,
					solved: true,
				},
			});
		}

		this.ref.detectChanges();
	}

	/**
	 * Get all remaining todos.
	 */
	public getRemaining() {
		return this.todos.filter((todo) => !todo.completed);
	}

	/**
	 * Get all completed todos.
	 */
	public getCompleted() {
		return this.todos.filter((todo) => todo.completed);
	}
}
