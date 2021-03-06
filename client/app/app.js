'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import leanplum from 'leanplum-javascript-sdk';

import 'angular-socket-io';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import 'angular-validation-match';

import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';

import './app.scss';


leanplum.setAppIdForDevelopmentMode('app_WOLHGvhA1YccBk4WRfWwrXk3wok4GZIvfn2kU3f8ork',
  'dev_vYJLCLGD77s9GtMiF0gHdRoMiZsrryPa7vMBkPKCZXg');

// leanplum.setAppIdForProductionMode('app_WOLHGvhA1YccBk4WRfWwrXk3wok4GZIvfn2kU3f8ork',
//   'prod_6uGH0WWcNkCzouilZD01JRXd1qJpvMqelUDv0fGsXgs');
// }
leanplum.start('craig@leanplum.com');
leanplum.track('start');

angular.module('leanplumJavaScriptSdkSampleApp', [ngCookies, ngResource, ngSanitize,
  'btford.socket-io', uiRouter, uiBootstrap, _Auth, account, admin, 'validation.match', navbar,
  footer, main, constants, socket, util
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['leanplumJavaScriptSdkSampleApp'], {
      strictDi: true
    });
  });
