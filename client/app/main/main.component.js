import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';
import leanplum from 'leanplum-javascript-sdk';

export class MainController {
  $http;
  socket;
  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;
    this.settings = {
      isWebPushSupported: false,
      isWebPushSubscribed: false,
    };

    this.settings.isWebPushSupported = leanplum.isWebPushSupported();
    if (this.settings.isWebPushSupported) {
      leanplum.isWebPushSubscribed().then(subscriptionStatus => {
        this.settings.isWebPushSubscribed = subscriptionStatus;
        $scope.$apply();
      });
    }

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    this.$http.get('/api/things')
      .then(response => {
        this.awesomeThings = response.data;
        this.socket.syncUpdates('thing', this.awesomeThings);
      });
  }

  addThing() {
    if (this.newThing) {
      leanplum.track('add_thing', undefined, {
        thingName: this.newThing
      });
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    leanplum.track('delete_thing', undefined, {
      thingName: thing.name
    });
    this.$http.delete(`/api/things/${thing._id}`);
  }

  globalEvent(){
    leanplum.track('web push event');
   this.$http.post('https://www.leanplum.com/api?action=track&appId=app_WOLHGvhA1YccBk4WRfWwrXk3wok4GZIvfn2kU3f8ork&clientKey=dev_vYJLCLGD77s9GtMiF0gHdRoMiZsrryPa7vMBkPKCZXg&apiVersion=1.0.6&userId=craig@leanplum.com&createDisposition=CreateIfNeeded&devMode=true&event=webPushEvent&time=1516988516')
    console.log('Web push triggered')
  }

  toggleWebPush() {
    console.log('WebPush is ', this.settings.isWebPushSubscribed);
    if (!this.settings.isWebPushSubscribed) {
      console.log('Webpush unsubscribing user...');
      leanplum.unregisterFromWebPush();
    } else {
      console.log('Webpush subscribing user...');
      leanplum.registerForWebPush('/sw.min.js', subscriptionStatus => {
        console.log('Subscription status: %s', subscriptionStatus);
      });
    }
  }
}

export default angular.module('leanplumJavaScriptSdkSampleApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
