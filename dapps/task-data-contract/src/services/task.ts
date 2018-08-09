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
  DataContract
} from 'bcc';

import {
  Injectable, OnInit
} from 'angular-libs';

import {
  QueueId,
  EvanDescriptionService,
  EvanQueue,
  EvanBCCService,
  EvanCoreService,
  EvanBookmarkService
} from 'angular-core';

/**************************************************************************************************/

@Injectable()
export class TaskService implements OnInit {
  public createQueueID: QueueId;
  public ensAddress: string;

  constructor(
    public descriptionService: EvanDescriptionService,
    public queue: EvanQueue,
    public bccService: EvanBCCService,
    public coreService: EvanCoreService,
    public bookmarkService: EvanBookmarkService
  ) {
    this.ensAddress = this.descriptionService.getEvanENSAddress('tutorialtask');

    this.createQueueID = new QueueId(
      this.ensAddress,
      'TaskCreateDispatcher'
    );
  }

  getListEntryQueueID(contractAddress: string) {
    return new QueueId(
      this.ensAddress,
      'ListEntryDispatcher',
      contractAddress
    )
  }

  /**
   * Trigger the creation of a new task.
   * @param name name of the task
   */
  triggerTaskQueue(name: string) {
    this.queue.addQueueData(
      this.createQueueID,
      { name, }
    );
  }

  /**
   * Create a new DataContract instance.
   */
  getDataContract() {
    return new DataContract({
      cryptoProvider: this.bccService.description.cryptoProvider,
      dfs: this.bccService.CoreBundle.CoreRuntime.dfs,
      executor: this.bccService.executor,
      loader: this.bccService.contractLoader,
      nameResolver: this.bccService.nameResolver,
      sharing: this.bccService.sharing,
      web3: this.bccService.web3,
      description: this.bccService.description,
    });
  }

  /**
   * Create a new task data contract instance.
   * @param name name of the task data contract
   */
  async createNewTask(name: string) {
    // create new data contract instance
    const dataContract = this.getDataContract();

    // load dapp description to add contract metadata
    const dappDescription = await this.descriptionService.getDescription(this.ensAddress, true);
    dappDescription.name = name;
    dappDescription.i18n.name.en = name;
    dappDescription.i18n.name.de = name;

    return await dataContract.create(
      'tasks',
      this.coreService.activeAccount(),
      null,
      { public: dappDescription }
    );
  }

  /**
   * Reference the created contract into the users favorites
   * @param task task to save into the users favorites
   */
  async addToFavorites(address: any) {
    const description = await this.bookmarkService.getBookmarkDefinition(address)
    
    return this.bookmarkService.queueAddBookmark(address, description);
  }

  /**
   * Adds a list entry to an specific list
   * @param listEntry list entry to add, includes data of the todo and the corresponding task contract id and the list name
   */
  async addListEntry(taskId: string, listName: string, todoData: any) {
    const dataContract = this.getDataContract();

    await dataContract.addListEntries(
      taskId,
      [ listName ],
      [ todoData ],
      this.coreService.activeAccount()
    );
  }
}