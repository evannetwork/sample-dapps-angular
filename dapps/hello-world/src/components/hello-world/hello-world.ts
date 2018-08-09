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
  Component, OnInit, ChangeDetectorRef
} from 'angular-libs';

import {
  EvanCoreService,
  EvanMailboxService,
  EvanAddressBookService,
  EvanRoutingService,
  AsyncComponent
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'hello-world',
  templateUrl: 'hello-world.html'
})

export class HelloWorldComponent extends AsyncComponent {
  private addressbook: any;
  private balance: number;
  private contactCount: number;
  private loading: boolean;
  private myAccountId: string;

  constructor(
    private core: EvanCoreService,
    private ref: ChangeDetectorRef,
    private mailService: EvanMailboxService,
    private addressbookService: EvanAddressBookService,
    private routing: EvanRoutingService
  ) {
    super(ref);
  }

  async _ngOnInit() {
    console.log('Hello World');
    console.dir(this.core);
    console.dir(this.mailService);
    console.dir(this.addressbookService);
    console.dir(this.routing);

    // load data for my current account
    this.myAccountId = this.core.activeAccount();
    this.addressbook = await this.addressbookService.loadAccounts();
    this.balance = await this.core.getBalance(this.myAccountId);
    this.contactCount = Object.keys(this.addressbook).length;
    
    await this.mailService.getMails();
  }
}
