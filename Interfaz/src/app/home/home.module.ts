import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';

import { HomeComponent } from './home.component';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';
import { DataSheetComponent } from './components/data-sheet/data-sheet.component';
import { AcademicDataComponent } from './components/data-sheet/components/academic-data/academic-data.component';
import { CoursesComponent } from './components/data-sheet/components/courses/courses.component';
import { LanguagesComponent } from './components/data-sheet/components/languages/languages.component';
import { CertificationsComponent } from './components/data-sheet/components/certifications/certifications.component';
import { PublicationsComponent } from './components/data-sheet/components/publications/publications.component';
import { ExperiencesComponent } from './components/data-sheet/components/experiences/experiences.component';


@NgModule({
  declarations: [
    HomeComponent,
    PersonalDataComponent,
    DataSheetComponent,
    AcademicDataComponent,
    CoursesComponent,
    LanguagesComponent,
    CertificationsComponent,
    PublicationsComponent,
    ExperiencesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule
  ]
})
export class HomeModule { }
