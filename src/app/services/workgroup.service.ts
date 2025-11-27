import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collectionData,
  query,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  DocumentReference,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { WorkGroup } from '../models/workgroup.interface';

@Injectable({ providedIn: 'root' })
export class WorkgroupService {

  private collectionPath = 'workgroups';

  constructor(
    private firestore: Firestore,
    private users: UserService, 
    private auth: Auth) {}

  // Create a new workgroup. Members can be provided as DocumentReference[] or omitted.
  async createWorkGroup(data: { name: string; description?: string; members?: DocumentReference[]; isActive?: boolean; }) {
    const uid = this.auth.currentUser?.uid;
    
    if (!uid) 
        throw new Error('Not authenticated');

    const userRef: DocumentReference = this.users.getCurrentUserRef();
    const colRef = collection(this.firestore, this.collectionPath);
    const docRef = doc(colRef); // new auto-id doc

    const payload: any = {
      name: data.name,
      description: data.description || null,
      isActive: data.isActive ?? true,
      members: data.members || [userRef],
      createdBy: userRef,
      createdAt: serverTimestamp()
    };

    await setDoc(docRef, payload);
    return docRef.id;
  }

  // Get a single workgroup document
  async getWorkGroup(id: string): Promise<WorkGroup | null> {
    const ref = doc(this.firestore, `${this.collectionPath}/${id}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as any) } as WorkGroup;
  }

  // Observable list of workgroups. Optional filter: only active groups
//   listWorkGroups(activeOnly = false): Observable<WorkGroup[]> {
//     const colRef = collection(this.firestore, this.collectionPath);
    
//     let q: any = colRef;
//     if (activeOnly) {
//         q = query(colRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
//     } 
//     else {
//         q = query(colRef, orderBy('createdAt', 'desc'));
//     }

//     return collectionData(q, { idField: 'id' }) as Observable<WorkGroup[]>;
//   }

  // Observable list of MY workgroups. The ones that I am member (includes the one I've created)
  listMyWorkGroups(): Observable<WorkGroup[]> {
    const uid = this.auth.currentUser?.uid;
    
    if (!uid) 
        throw new Error('Not authenticated');

    const userRef: DocumentReference = this.users.getCurrentUserRef();
    const colRef = collection(this.firestore, this.collectionPath);  

    console.log(userRef);
    

    let q: any = colRef;
    q = query(colRef, where('members', 'array-contains', userRef));

    return collectionData(q, { idField: 'id' }) as Observable<WorkGroup[]>;
  }

  // Update basic fields for a workgroup
  async updateWorkGroup(id: string, changes: Partial<WorkGroup>) {
    const ref = doc(this.firestore, `${this.collectionPath}/${id}`);
    await updateDoc(ref, changes as any);
  }

  // Soft delete / toggle active
  async setActive(id: string, isActive: boolean) {
    const ref = doc(this.firestore, `${this.collectionPath}/${id}`);
    await updateDoc(ref, { isActive } as any);
  }

  // Add a member (DocumentReference expected)
  async addMember(id: string, memberRef: DocumentReference) {
    const ref = doc(this.firestore, `${this.collectionPath}/${id}`);
    await updateDoc(ref, { members: arrayUnion(memberRef) } as any);
  }

  // Remove a member
  async removeMember(id: string, memberRef: DocumentReference) {
    const ref = doc(this.firestore, `${this.collectionPath}/${id}`);
    await updateDoc(ref, { members: arrayRemove(memberRef) } as any);
  }

  // Permanently delete a workgroup document (use with caution)
  async deleteWorkGroup(id: string) {
    const ref = doc(this.firestore, `${this.collectionPath}/${id}`);
    await deleteDoc(ref);
  }
}
