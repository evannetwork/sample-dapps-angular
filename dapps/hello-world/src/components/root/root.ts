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
  Component, OnInit,     // @angular/core
  DomSanitizer, ChangeDetectorRef,
} from 'angular-libs';

import {
  AnimationDefinition,
  EvanBCCService,
  EvanCoreService,
  EvanDefinitionService,
  EvanMailboxService,
  EvanRoutingService,
  createOpacityTransition,
  createRouterTransition,
  AsyncComponent
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'hello-world-root',
  templateUrl: 'root.html',
  animations: [
    createRouterTransition([
      new AnimationDefinition('hello-world-1', '=>', 'hello-world-2', 'right'),
      new AnimationDefinition('hello-world-2', '=>', 'hello-world-1', 'left'),
    ])
  ]
})

export class RootComponent extends AsyncComponent {
  private loading: boolean;
  private watchRouteChange: Function;

  constructor(
    private core: EvanCoreService,
    private bcc: EvanBCCService,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService
  ) {
    super(ref);
  }

  async _ngOnInit() {
    await this.bcc.initialize((accountId) => this.bcc.globalPasswordDialog(accountId));
    this.watchRouteChange = this.routingService.subscribeRouteChange(() => this.ref.detectChanges());
    this.core.finishDAppLoading();
  }

  async _ngOnDestroy() {
    this.watchRouteChange();
  }
}
