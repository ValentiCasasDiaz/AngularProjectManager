import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "myprojectmanager-4fb84", appId: "1:691589361177:web:eb0bab0b9af524da868488", storageBucket: "myprojectmanager-4fb84.firebasestorage.app", apiKey: "AIzaSyAueitSoP1Gj58z8OMrIMPC_cAbZVbHz14", authDomain: "myprojectmanager-4fb84.firebaseapp.com", messagingSenderId: "691589361177", projectNumber: "691589361177", version: "2" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
