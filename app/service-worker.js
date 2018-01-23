// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var dataCacheName = 'bvKart';
var cacheName = 'bvKartCache';
var filesToCache = [
  './',
  'index.html',
  '/js/app.js',
  '/css/creative.css',
  '/img/home.jpeg',
  '/img/icons/vrum.png',
  '/img/portfolio/thumbnails/1.jpeg',
  '/img/portfolio/thumbnails/2.jpeg',
  '/img/portfolio/thumbnails/3.jpeg',
  '/img/portfolio/thumbnails/4.jpeg',
  '/img/portfolio/thumbnails/5.jpeg',
  '/img/portfolio/thumbnails/6.jpg',
  '/img/portfolio/fullsize/1.jpeg',
  '/img/portfolio/fullsize/2.jpeg',
  '/img/portfolio/fullsize/3.jpeg',
  '/img/portfolio/fullsize/4.jpeg',
  '/img/portfolio/fullsize/5.jpeg',
  '/img/portfolio/fullsize/6.jpg'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});
 
self.addEventListener('beforeinstallprompt', function(e) {
  // beforeinstallprompt Event fired

  // e.userChoice will return a Promise.
  e.userChoice.then(function(choiceResult) {

    console.log(choiceResult.outcome);

    if(choiceResult.outcome == 'dismissed') {
      console.log('User cancelled home screen install');
    }
    else {
      console.log('User added to home screen');
    }
  });
});