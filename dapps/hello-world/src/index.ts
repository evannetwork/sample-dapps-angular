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
  DAppLoaderComponent,
  buildModuleRoutes,
  BootstrapComponent,
  startAngularApplication, createIonicAppElement,
} from 'angular-core';

import { RootComponent } from './components/root/root';
import { HelloWorldComponent } from './components/hello-world/hello-world';
import { HelloWorld2Component } from './components/hello-world-2/hello-world-2';

import { Translations } from './i18n/registry';
import { HelloWorldService } from './services/helloworld.service';

/**************************************************************************************************/

const dbcpOrigin = 'helloworld';

/**
 * Returns the route definitions
 */
function getRoutes(): Routes {
  const helloWorldRoutes: Array<any> = [
    {
      path: '',
      redirectTo: `hello-world-1`,
      pathMatch: 'full'
    },
    {
      path: `hello-world-1`,
      data: {
        // used for router transition tracking
        state: 'hello-world-1',
        navigateBack: true,
      },
      component: HelloWorldComponent,
    },
    {
      path: `hello-world-2`,
      data: {
        // used for router transition tracking
        state: 'hello-world-2',
        navigateBack: true,
      },
      component: HelloWorld2Component,
    },
  ];

  // Defines the root route, fallback routes and applies the evan default routes to handle
  // queue, mailbox and anything else within this application
  return buildModuleRoutes(
    `${ dbcpOrigin }.${ getDomainName() }`,
    RootComponent,
    [
      {
        path: ':address',
        data: {
          state: 'hello-world-1',
          navigateBack: true
        },
        children: helloWorldRoutes
      },
    ]
    .concat(helloWorldRoutes)
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
      AngularCore,
    ],
    // reference your services
    providers: [
      Translations,
      HelloWorldService
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
      HelloWorldComponent,
      HelloWorld2Component
    ];
  }

  return config;
}

// declare your module
@NgModule(getConfig())
class HelloWorldModule {
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
  const ionicAppEl = createIonicAppElement(container, `helloworld.${ getDomainName() }`);

  await startAngularApplication(HelloWorldModule, getRoutes());

  container.appendChild(ionicAppEl);
}
