import { Injectable } from '@angular/core';
import { Auth, updateProfile, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { sendEmailVerification, sendPasswordResetEmail as firebaseSendPasswordResetEmail, reauthenticateWithCredential as firebaseReauthenticateWithCredential, EmailAuthProvider as FirebaseEmailAuthProvider, updatePassword as firebaseUpdatePassword } from 'firebase/auth';
import { DocumentReference, Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class UserService {

  private collectionPath = 'users';
  currentUser$: Observable<any>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.currentUser$ = user(this.auth);
  }

  async uploadProfileImage(file: File): Promise<string> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('Not authenticated');

    const storage = getStorage();
    // Use a fixed filename per user so uploads overwrite the previous avatar
    const storageRef = ref(storage, `avatars/${uid}/avatar_${uid}${file.name.substring(file.name.lastIndexOf('.'))}`);

    // Overwrite previous file by uploading to the same path
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  }

  async sendVerificationEmail(): Promise<void> {
    const current = this.auth.currentUser;
    if (!current) throw new Error('Not authenticated');
    await sendEmailVerification(current);
  }

  async sendPasswordReset(email: string): Promise<void> {
    if (!email) throw new Error('Email required');
    await firebaseSendPasswordResetEmail(this.auth as any, email);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const current = this.auth.currentUser;
    if (!current) throw new Error('Not authenticated');
    if (!current.email) throw new Error('Current user has no email credential');

    // Reauthenticate with current password, then update the password
    const credential = FirebaseEmailAuthProvider.credential(current.email, currentPassword);
    await firebaseReauthenticateWithCredential(current, credential);
    await firebaseUpdatePassword(current, newPassword);
  }

  async updateProfileData(data: { displayName?: string; photoURL?: string; phoneNumber?: string; }) {
    const current = this.auth.currentUser;
    if (!current) throw new Error('Not authenticated');

    // Update displayName / photoURL via updateProfile
    if (data.displayName || data.photoURL) {
      await updateProfile(current, { displayName: data.displayName, photoURL: data.photoURL });
    }

    return true;
  }

  // Roles management stored in Firestore under `{this.collectionPath}/{uid}.roles`
  async setUserRoles(uid: string, roles: Record<string, boolean>) {
    if (!uid) throw new Error('uid required');
    
    const ref = doc(this.firestore, `${this.collectionPath}/${uid}`);
    // Merge roles into the user document
    await setDoc(ref, { roles }, { merge: true } as any);
  }

  // NOT USED
  // async getUserDoc(uid: string) {
    
  //   if (!uid) 
  //     throw new Error('uid required');

  //   const ref = doc(this.firestore, `${this.collectionPath}/${uid}`);
  //   const snap = await getDoc(ref);

  //   return snap.exists() ? snap.data() : null;
  // }

  getCurrentUserRef(): DocumentReference {
    const uid = this.auth.currentUser?.uid;

    if (!uid) 
      throw new Error('uid required');

    return doc(this.firestore, `${this.collectionPath}/${uid}`);
  }
}
