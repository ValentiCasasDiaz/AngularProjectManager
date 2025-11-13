import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { UserService } from '../../services/user.service';

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
        MatSnackBarModule,
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
    showChangePassword = false;
    changePwdForm = new FormGroup({
        currentPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', Validators.required),
    });

    isChangingPassword = false;

    selectedFile: File | null = null;
    previewUrl: string | null = null;
    isSaving = false;
    emailVerified = false;

    constructor(
        private userService: UserService, 
        private snack: MatSnackBar) { }

    ngOnInit(): void {

        this.userService.currentUser$.subscribe(user => {
            if (user) {
                // email is shown as disabled informational field
                this.form.patchValue({
                    email: user.email || '',
                    displayName: user.displayName || ''
                });
                this.previewUrl = user.photoURL || null;
                this.emailVerified = !!user.emailVerified;

                console.log(user);
                
            }
        });

    }

    toggleChangePassword() {
        this.showChangePassword = !this.showChangePassword;
    }

    async changePassword() {
        if (this.changePwdForm.invalid) return;

        const current = this.changePwdForm.value.currentPassword as string;
        const newPwd = this.changePwdForm.value.newPassword as string;
        const confirm = this.changePwdForm.value.confirmPassword as string;

        if (newPwd !== confirm) {
            this.snack.open('La nova contrasenya i la confirmació no coincideixen', 'Tancar', { duration: 3000 });
            return;
        }

        this.isChangingPassword = true;
        try {
            await this.userService.changePassword(current, newPwd);
            this.snack.open('Contrasenya actualitzada correctament', 'Tancar', { duration: 3000 });
            this.changePwdForm.reset();
            this.showChangePassword = false;
        } catch (err: any) {
            console.error('Error changing password', err);
            this.snack.open(err?.message || 'Error canviant la contrasenya', 'Tancar', { duration: 4000 });
        } finally {
            this.isChangingPassword = false;
        }
    }

    async sendVerification() {
        try {
            await this.userService.sendVerificationEmail();
            this.snack.open('Correu de verificació enviat', 'Tancar', { duration: 3000 });
        } catch (err: any) {
            console.error('Error sending verification', err);
            this.snack.open(err?.message || 'Error enviant el correu de verificació', 'Tancar', { duration: 4000 });
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

        this.isSaving = true;

        try {
            let photoURL: string | undefined;
            if (this.selectedFile) {
                photoURL = await this.userService.uploadProfileImage(this.selectedFile);
            }

            await this.userService.updateProfileData({
                displayName: (this.form.value.displayName ?? '') as string,
                photoURL
            });

            this.snack.open('Perfil actualitzat', 'Tancar', { duration: 3000 });

        } catch (err: any) {
            console.error(err);
            this.snack.open(err?.message || 'Error actualitzant el perfil', 'Tancar', { duration: 4000 });
        } finally {
            this.isSaving = false;
        }
    }
}
