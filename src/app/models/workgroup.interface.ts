import { DocumentReference } from "@angular/fire/firestore";

export interface WorkGroup {
  id?: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: any;
  createdBy?: string;
  members?: DocumentReference[];
}