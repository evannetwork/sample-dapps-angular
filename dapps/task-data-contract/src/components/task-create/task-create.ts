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
  Component, ChangeDetectorRef, OnInit, OnDestroy  // @angular/core
} from 'angular-libs';

import {
  EvanQueue,
  EvanAlertService,
  EvanRoutingService,
  AsyncComponent
} from 'angular-core';

import {
  TaskService
} from '../../services/task';

/**************************************************************************************************/

@Component({
  selector: 'task-create',
  templateUrl: './task-create.html'
})
export class TaskCreateComponent extends AsyncComponent {
  public taskName = '';
  public contractId: string;
  
  private onCreation: Function;
  private loading: boolean;
  
  constructor(
    public alertService: EvanAlertService,
    public queue: EvanQueue,
    public ref: ChangeDetectorRef,
    public routinService: EvanRoutingService,
    public taskService: TaskService,
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.onCreation = await this.queue.onQueueFinish(this.taskService.createQueueID, async (reload, data) => {
      if (reload) {
        try {
          if (!(data[0] instanceof Error)) {
            await this.alertService.showSubmitAlert(
              '_tutorialtask.task-created',
              '_tutorialtask.task-created-description',
              '_tutorialtask.cancel',
              '_tutorialtask.ok',
            );

            this.routinService.navigate(`./${ data[0] }`);
          }

          this.loading = false;
          this.ref.detectChanges();
        } catch (ex) { }
      }
    });
  }

  /**
   * Unbind onCreation listener
   */
  async _ngOnDestroy() {
    this.onCreation();
  }

  /**
   * Create a new contract instance.
   */
  createNewContract() {
    this.loading = true;
    this.taskService.triggerTaskQueue(this.taskName);
    this.taskName = '';
    this.ref.detectChanges();
  }
}