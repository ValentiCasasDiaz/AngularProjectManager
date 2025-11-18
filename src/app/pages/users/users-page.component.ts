import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent {
  users$: Observable<any[]>;

  constructor(private firestore: Firestore) {
    const usersCol = collection(this.firestore, 'users');
    this.users$ = collectionData(usersCol, { idField: 'id' });
  }

  async deleteUser(docId: string) {
    // Deleting from Firestore only; actual Auth user deletion requires backend/admin privileges
    if (!confirm('Segur que vols eliminar aquest usuari? Aquesta acció només elimina el document de Firestore.')) return;
    try {
      await deleteDoc(doc(this.firestore, `users/${docId}`));
      // no further action here
    } catch (err) {
      console.error('Error deleting user doc', err);
    }
  }
}
