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
  Injectable, // @angular/core
} from 'angular-libs';

import {
  EvanCoreService,
  SingletonService,
  EvanTranslationService
} from 'angular-core';

/**************************************************************************************************/

@Injectable()
export class HelloWorldService {
  constructor(
    private singleton: SingletonService,
    private core: EvanCoreService,
    private translations: EvanTranslationService
  ) {
    return singleton.create(HelloWorldService, this, () => {
      // do something on first time when task was initialized
    }, true);
  }

  getHelloWorld() {
    return this.translations.instant('hello-world');
  }
}
