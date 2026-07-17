import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonInput, IonToggle, IonButton, IonIcon, IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, saveOutline } from 'ionicons/icons';
import { ScheduleService } from '../../services/schedule.service';
import { NotificationService } from '../../services/notification.service';
import { ScheduleBlock } from '../../models/schedule-block.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonInput, IonToggle, IonButton, IonIcon, IonNote,
  ],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
})
export class SettingsPage implements OnInit {
  blocks = signal<ScheduleBlock[]>([]);
  saved = signal(false);

  constructor(private scheduleService: ScheduleService, private notificationService: NotificationService) {
    addIcons({ addOutline, trashOutline, saveOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.scheduleService.load();
    // clone so edits don't mutate the signal until saved
    this.blocks.set(this.scheduleService.blocks().map(b => ({ ...b })));
  }

  addBlock(): void {
    const id = 'custom-' + Date.now();
    this.blocks.set([
      ...this.blocks(),
      { id, name: 'New activity', icon: 'star-outline', startTime: '09:00', endTime: '10:00', color: '#888888', trackStreak: true, enabled: true },
    ]);
  }

  removeBlock(id: string): void {
    this.blocks.set(this.blocks().filter(b => b.id !== id));
  }

  async saveAll(): Promise<void> {
    await this.scheduleService.save(this.blocks());
    // Re-schedule native notifications to match the edited schedule
    await this.notificationService.scheduleAll(this.blocks());
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }
}
