import { Injectable } from '@angular/core';
import { Auth, updateProfile, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { sendEmailVerification } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class UserService {
  currentUser$: Observable<any>;

  constructor(private auth: Auth) {
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

  async updateProfileData(data: { displayName?: string; photoURL?: string; phoneNumber?: string; }) {
    const current = this.auth.currentUser;
    if (!current) throw new Error('Not authenticated');

    // Update displayName / photoURL via updateProfile
    if (data.displayName || data.photoURL) {
      await updateProfile(current, { displayName: data.displayName, photoURL: data.photoURL });
    }

    // Note: phoneNumber update typically requires linking a phone credential.
    return true;
  }
}
