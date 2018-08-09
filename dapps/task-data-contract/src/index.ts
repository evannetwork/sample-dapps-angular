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
  getDomainName,
} from 'dapp-browser';

import {
  NgModule,                    // @angular/core
  CommonModule,                // @angular/common
  RouterModule, Routes,        // @angular/router
  IonicModule, IonicApp,       // ionic-angular
  BrowserAnimationsModule,     // @angular/platform-browser/animations
} from 'angular-libs';

import {
  AngularCore,
  buildModuleRoutes,
  BootstrapComponent,
  startAngularApplication, createIonicAppElement,
} from 'angular-core';

import { RootComponent } from './components/root/root';
import { TodoApp } from './components/app/app';
import { TaskCreateComponent } from './components/task-create/task-create';

import { Translations } from './i18n/registry';
import { TaskService } from './services/task';

import { TaskCreateDispatcher } from './dispatcher/task-dispatcher';
import { ListEntryDispatcher } from './dispatcher/task-dispatcher';

// export TaskService and TaskCreateDispatcher for dispatcher module runtime
export { TaskService, TaskCreateDispatcher, ListEntryDispatcher }

/**************************************************************************************************/

const dbcpOrigin = 'tutorialtask';

/**
 * Returns the route definitions
 */
function getRoutes(): Routes {
  // Defines the root route, fallback routes and applies the evan default routes to handle
  // queue, mailbox and anything else within this application
  return buildModuleRoutes(
    `${ dbcpOrigin }.${ getDomainName() }`,
    RootComponent,
    [
      {
        path: '',
        component: TaskCreateComponent,
        data: {
          state: 'task-create',
          navigateBack: true
        },
      },
      {
        path: ':address',
        component: TodoApp,
        data: {
          state: 'task-detail',
          navigateBack: true
        }
      },
    ]
  );
}

/**
 * Returns the module configuration for the normal or dispatcher module.
 * In case of the dispatcher module, Router configurations and BrowserModule imports are excluded
 * to load the module during runtime by the dispatcher service.
 *
 * @param isDispatcher  boolean value if the config is used for the dispatcher module
 */
function getConfig(isDispatcher?: boolean) {
  let config: any = {
    imports: [
      CommonModule,
      AngularCore
    ],
    // reference your services
    providers: [
      Translations,
      TaskService
    ]
  };

  if (!isDispatcher) {
    config.imports.unshift(BrowserAnimationsModule);
    config.imports.unshift(RouterModule.forRoot(getRoutes(), { enableTracing: false, }));

    // start the application with the angular-core bootstrap component
    config.imports.push(IonicModule.forRoot(BootstrapComponent, {
      mode: 'md'
    }));

    // start with the IonicApp module
    config.bootstrap = [
      IonicApp
    ];

    // declare your components that should be included
    config.declarations = [
      BootstrapComponent,
      RootComponent,
      TodoApp,
      TaskCreateComponent
    ];
  }

  return config;
}

@NgModule(getConfig(true))
export class DispatcherModule {
  constructor() { }
}

// declare your module
@NgModule(getConfig())
class TutorialTaskModule {
  constructor(
    // registered your translations
    private translations: Translations,
  ) { }
}

/**
 * 
 * @param container  container, where the application should be rendered in
 * @param dbcpName   The name that is included in the dbcp, where this file was load from 
 */
export async function startDApp(container, dbcpName) {
  const ionicAppEl = createIonicAppElement(container, `${ dbcpOrigin }.${ getDomainName() }`);

  await startAngularApplication(TutorialTaskModule, getRoutes());

  container.appendChild(ionicAppEl);
}
