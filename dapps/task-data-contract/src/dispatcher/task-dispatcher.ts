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
  Injectable,
} from 'angular-libs';

import {
  QueueSequence,
  QueueDispatcher,
  SingletonService
} from 'angular-core';

import {
  translations
} from '../i18n/registry';

import {
  TaskService
} from '../services/task';

/**************************************************************************************************/

export const TaskCreateDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_tutorialtask.dispatcher.create-task',
      '_tutorialtask.dispatcher.create-task-description',
      async (service: TaskService, queueEntry: any) => {
        const tasks = queueEntry.data;
        const results = [ ];
        
        for (let task of tasks) {
          // create new task
          const newTask = await service.createNewTask(task.name);

          // reference to my favorites
          await service.addToFavorites(newTask._address);

          results.push(newTask._address);
        }

        return results;
      }
    )
  ],
  translations,
  'TaskService'
);

export const ListEntryDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_tutorialtask.dispatcher.list-entry',
      '_tutorialtask.dispatcher.list-entry-description',
      async (service: TaskService, queueEntry: any) => {
        const listEntries = queueEntry.data;
        
        for (let entry of listEntries) {
          await service.addListEntry(entry.taskId, entry.listName, entry.data);
        }
      }
    )
  ],
  translations,
  'TaskService'
);