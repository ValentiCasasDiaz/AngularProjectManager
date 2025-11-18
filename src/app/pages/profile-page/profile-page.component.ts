import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

    form = new FormGroup({
        email: new FormControl({ value: '', disabled: true }),
        displayName: new FormControl('', Validators.required)
    });

    // Change password form
    showChangePassword = signal(false);
    changePwdForm = new FormGroup({
        currentPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', Validators.required),
    });

    isChangingPassword = signal(false);

    // Image upload
    selectedFile: File | null = null;
    previewUrl: string | null = null;
    
    // Email verification
    emailVerified = signal(false);

    isSaving = signal(false);

    constructor(
        private userService: UserService, 
        private noti: NotificationService) { }

    ngOnInit(): void {

        this.userService.currentUser$.subscribe(user => {
            if (user) {
                // email is shown as disabled informational field
                this.form.patchValue({
                    email: user.email || '',
                    displayName: user.displayName || ''
                });
                this.previewUrl = user.photoURL || null;
                this.emailVerified.set(!!user.emailVerified);
            }
        });

    }

    toggleChangePassword() {
        this.showChangePassword.set(!this.showChangePassword);
    }

    async changePassword() {
        if (this.changePwdForm.invalid) return;

        const current = this.changePwdForm.value.currentPassword as string;
        const newPwd = this.changePwdForm.value.newPassword as string;
        const confirm = this.changePwdForm.value.confirmPassword as string;

        if (newPwd !== confirm) {
            this.noti.error('La nova contrasenya i la confirmació no coincideixen');
            return;
        }

        this.isChangingPassword.set(true);

        try {
            await this.userService.changePassword(current, newPwd);
            this.noti.success('Contrasenya actualitzada correctament');
            this.changePwdForm.reset();
            this.showChangePassword.set(false);

        } catch (err: any) {
            this.noti.error('Error canviant la contrasenya');
        
        } finally {
            this.isChangingPassword.set(false);
        }
    }

    async sendVerification() {
        try {
            await this.userService.sendVerificationEmail();
            this.noti.success('Correu de verificació enviat');
        } catch (err: any) {
            this.noti.error('Error enviant el correu de verificació');
        }
    }

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length) {
            this.selectedFile = input.files[0];
            const reader = new FileReader();
            reader.onload = () => this.previewUrl = reader.result as string;
            reader.readAsDataURL(this.selectedFile);
        }
    }

    async save() {
        if (this.form.invalid) return;

        this.isSaving.set(true);

        try {
            let photoURL: string | undefined;
            if (this.selectedFile) {
                photoURL = await this.userService.uploadProfileImage(this.selectedFile);
            }

            await this.userService.updateProfileData({
                displayName: (this.form.value.displayName ?? '') as string,
                photoURL
            });

            this.noti.info('Perfil actualitzat');

        } catch (err: any) {
            this.noti.error('Error actualitzant el perfil');
        } finally {
            this.isSaving.set(false);
        }
    }
}
