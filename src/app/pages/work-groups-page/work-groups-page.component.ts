import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Services
import { WorkgroupService } from '../../services/workgroup.service';
import { NotificationService } from '../../services/notification.service';

// Data
import { WorkGroup } from '../../models/workgroup.interface';


@Component({
  selector: 'app-work-groups-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './work-groups-page.component.html',
  styleUrls: ['./work-groups-page.component.scss']
})
export class WorkGroupsPageComponent {

  groups$: Observable<WorkGroup[]>;
  editing: WorkGroup | null = null;
  isSaving = false;
  search = new FormControl('');
  
  fb: FormBuilder = new FormBuilder();

  form = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.maxLength(120)]],
    description: [''],
    isActive: [true]
  });

  constructor(
    protected wg: WorkgroupService, 
    private noti: NotificationService) 
  {
    this.groups$ = this.wg.listMyWorkGroups();
  }

  newGroup() {
    this.editing = null;
    this.form.reset({ name: '', description: '', isActive: true });
  }

  editGroup(g: WorkGroup) {
    this.editing = g;
    this.form.patchValue(
        { id: g.id, name: g.name, description: g.description || '', isActive: !!g.isActive });
  }

  async save() {
    if (this.form.invalid) 
        return;
    
    this.isSaving = true;
    const v = this.form.value;
    
    try {
      if (!v.id) {
        const id = await this.wg.createWorkGroup(
          { name: v.name!, description: v.description || '', isActive: v.isActive || true });
        this.noti.success('Grup creat');
        this.form.patchValue({ id });
      } 
      else {
        await this.wg.updateWorkGroup(v.id, 
            { name: v.name!, description: v.description || '', isActive: v.isActive || true });
        this.noti.success('Grup actualitzat');
      }
    } catch (err: any) {
      this.noti.error(err?.message || 'Error guardant el grup');
    } finally {
      this.isSaving = false;
    }
  }

  async deleteGroup(g: WorkGroup) {
    if (!g.id) return;
    if (!confirm('Segur que vols eliminar aquest grup? Aquesta acció és irreversible.')) return;
    try {
      await this.wg.deleteWorkGroup(g.id);
      this.noti.success('Grup eliminat');
      this.newGroup();
    } catch (err: any) {
      this.noti.error('Error eliminant grup');
    }
  }
}
