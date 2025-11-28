import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteTestComponent } from './palette-test.component';

describe('PaletteTestComponent', () => {
  let component: PaletteTestComponent;
  let fixture: ComponentFixture<PaletteTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaletteTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaletteTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
