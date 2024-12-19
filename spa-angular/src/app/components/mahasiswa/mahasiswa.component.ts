import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-mahasiswa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mahasiswa.component.html',
  styleUrls: ['./mahasiswa.component.css'],
})
export class MahasiswaComponent implements OnInit {
  mahasiswaList: any[] = [];
  prodiList: any[] = [];
  apiMahasiswaUrl = 'https://crud-express-seven.vercel.app/api/mahasiswa';
  apiProdiUrl = 'https://crud-express-seven.vercel.app/api/prodi';
  isLoading = true;
  mahasiswaForm: FormGroup;
  isSubmitting = false;

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor() {
    this.mahasiswaForm = this.fb.group({
      npm: [''],
      nama: [''],
      prodi_id: [null],
      jenis_kelamin: ['L'],
      asal_sekolah: [''],
    });
  }

  ngOnInit(): void {
    this.getMahasiswa();
    this.getProdi();
  }

  // Fetch Mahasiswa Data
  getMahasiswa(): void {
    this.http.get<any[]>(this.apiMahasiswaUrl).subscribe({
      next: (data) => {
        this.mahasiswaList = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching mahasiswa data:', err);
        this.isLoading = false;
      },
    });
  }

  // Fetch Prodi Data
  getProdi(): void {
    this.http.get<any[]>(this.apiProdiUrl).subscribe({
      next: (data) => {
        this.prodiList = data;
      },
      error: (err) => {
        console.error('Error fetching prodi data:', err);
      },
    });
  }

  // Add Mahasiswa
  addMahasiswa(): void {
    if (this.mahasiswaForm.valid) {
      this.isSubmitting = true;
      this.http.post(this.apiMahasiswaUrl, this.mahasiswaForm.value).subscribe({
        next: (response) => {
          console.log('Mahasiswa berhasil ditambahkan:', response);
          this.getMahasiswa();
          this.mahasiswaForm.reset({ jenis_kelamin: 'L' });
          this.isSubmitting = false;

          const modalElement = document.getElementById(
            'tambahMahasiswaModal'
          ) as HTMLElement;
          if (modalElement) {
            const modalInstance =
              bootstrap.Modal.getInstance(modalElement) ||
              new bootstrap.Modal(modalElement);
            modalInstance.hide();
          }
        },
        error: (err) => {
          console.error('Error menambahkan mahasiswa:', err);
          this.isSubmitting = false;
        },
      });
    }
  }

  editMahasiswaId: string | null = null;

  getMahasiswaById(_id: string): void {
    this.editMahasiswaId = _id; // Store the ID of the Mahasiswa to be edited
    const mahasiswaToEdit = this.mahasiswaList.find((m) => m._id === _id);

    if (mahasiswaToEdit) {
      this.mahasiswaForm.patchValue({
        npm: mahasiswaToEdit.npm,
        nama: mahasiswaToEdit.nama,
        prodi_id: mahasiswaToEdit.prodi_id,
        jenis_kelamin: mahasiswaToEdit.jenis_kelamin,
        asal_sekolah: mahasiswaToEdit.asal_sekolah,
      });

      // Open the edit modal
      const modalElement = document.getElementById(
        'editMahasiswaModal'
      ) as HTMLElement;
      if (modalElement) {
        const modalInstance =
          bootstrap.Modal.getInstance(modalElement) ||
          new bootstrap.Modal(modalElement);
        modalInstance.show();
      }
    }
  }

  updateMahasiswa(): void {
    if (this.mahasiswaForm.valid) {
      this.isSubmitting = true;
      this.http
        .put(
          `${this.apiMahasiswaUrl}/${this.editMahasiswaId}`,
          this.mahasiswaForm.value
        )
        .subscribe({
          next: (response) => {
            console.log('Mahasiswa berhasil diperbarui:', response);
            this.getMahasiswa(); // Refresh the list of Mahasiswa
            this.isSubmitting = false;

            // Close the edit modal
            const modalElement = document.getElementById(
              'editMahasiswaModal'
            ) as HTMLElement;
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
          },
          error: (err) => {
            console.error('Error updating Mahasiswa:', err);
            this.isSubmitting = false;
          },
        });
    }
  }
  deleteMahasiswa(_id: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      this.http.delete(`${this.apiMahasiswaUrl}/${_id}`).subscribe({
        next: () => {
          console.log(`Mahasiswa dengan ID ${_id} berhasil dihapus`);
          this.getMahasiswa(); // Refresh the list of Mahasiswa after deletion
        },
        error: (err) => {
          console.error('Error menghapus Mahasiswa:', err);
        },
      });
    }
  }
}
