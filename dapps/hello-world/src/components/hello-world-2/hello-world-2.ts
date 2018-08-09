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
  Component, OnInit, ChangeDetectorRef,
} from 'angular-libs';

import {
  EvanCoreService,
  EvanRoutingService,
  EvanBCCService,
  EvanDescriptionService,
  AsyncComponent
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'hello-world-2',
  templateUrl: 'hello-world-2.html'
})

export class HelloWorld2Component extends AsyncComponent {
  private contract: any;
  private contractId: string;
  private definition: any;
  private loading: boolean;
  private owner: string;
  private sample1: string;
  private sample2: string;

  constructor(
    private core: EvanCoreService,
    private ref: ChangeDetectorRef,
    private routing: EvanRoutingService,
    // include bcc to handle blockchain core
    private bcc: EvanBCCService,
    private definitionService: EvanDescriptionService
  ) {
    super(ref);
  }

  async _ngOnInit() {
    // check if this DApp is used within an contract, so load contract data
    const contractId = this.routing.getHashParam('address');
    
    if (contractId && contractId.indexOf('0x') === 0) {
      this.loading = true;

      console.dir(this.bcc);
      console.dir(this.definitionService);

      this.contractId = contractId;
      this.contract = await this.bcc.definition.loadContract(this.contractId);
      this.owner = await this.contract.methods.owner().call();
      this.sample1 = await this.contract.methods.greet().call();
      this.sample2 = await this.bcc.executor.executeContractCall(this.contract, 'greet');
      this.definition = JSON.stringify(
        await this.definitionService.getDefinition(this.contractId),
        null,
        2
      );
    }
  }
}
