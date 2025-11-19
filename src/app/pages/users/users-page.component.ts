import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Services
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-users-page',
    standalone: true,
    imports: [
        CommonModule, 
        MatCardModule, 
        MatListModule, 
        MatIconModule, 
        MatButtonModule, 
        MatDividerModule, 
        MatSlideToggleModule, 
    ],
    templateUrl: './users-page.component.html',
    styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent {

    users$: Observable<any[]>;

    constructor(
        private firestore: Firestore,
        private userService: UserService,
        private noti: NotificationService
    ) {
        const usersCol = collection(this.firestore, 'users');
        this.users$ = collectionData(usersCol, { idField: 'id' });
    }

    async toggleAdmin(u: any, event: any) {
        const checked = !!event.checked;
        try {
            await this.userService.setUserRoles(u.id, { ...(u.roles || {}), admin: checked });
            this.noti.success('Rol actualitzat');
        } catch (err) {
            this.noti.error('Error actualitzant rol');
        }
    }

    async removeUserDoc(u: any) {
        if (!confirm('Segur que vols eliminar el document d\'usuari? Això no elimina l\'autenticació.')) return;
        try {
            await updateDoc(doc(this.firestore, `users/${u.id}`), { deleted: true } as any);
            this.noti.success('Usuari marcat com a eliminat');
        } catch (err) {
            this.noti.error('Error marcant usuari');
        }
    }
}
