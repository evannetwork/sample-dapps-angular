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
	TodoStore,
	Todo
} from '../../services/store';

/**************************************************************************************************/

@Component({
	selector: 'todo-app',
	templateUrl: './app.html'
})
export class TodoApp {
	newTodoText = '';

	constructor(
		public todoStore: TodoStore,
		public ref: ChangeDetectorRef
	) { }

	stopEditing(todo: Todo, editedTitle: string) {
		todo.title = editedTitle;
		todo.editing = false;

		this.ref.detectChanges();
	}

	cancelEditingTodo(todo: Todo) {
		todo.editing = false;
		
		this.ref.detectChanges();
	}

	updateEditingTodo(todo: Todo, editedTitle: string) {
		editedTitle = editedTitle.trim();
		todo.editing = false;

		if (editedTitle.length === 0) {
			this.todoStore.remove(todo);

			return this.ref.detectChanges();
		}

		todo.title = editedTitle;
	}

	editTodo(todo: Todo) {
		todo.editing = true;

		this.ref.detectChanges();
	}

	removeCompleted() {
		this.todoStore.removeCompleted();

		this.ref.detectChanges();
	}

	toggleCompletion(todo: Todo) {
		this.todoStore.toggleCompletion(todo);

		this.ref.detectChanges();
	}

	remove(todo: Todo){
		this.todoStore.remove(todo);

		this.ref.detectChanges();
	}

	addTodo() {
		if (this.newTodoText.trim().length) {
			this.todoStore.add(this.newTodoText);
			this.newTodoText = '';
		}

		this.ref.detectChanges();
	}
}
