import { CommonModule } from '@angular/common'; // Mengimpor modul Angular yang menyediakan direktif umum seperti ngIf, ngFor, dll.
import { Component, OnInit, inject } from '@angular/core'; // Mengimpor decorator Component, interface OnInit untuk inisialisasi, dan inject untuk injeksi dependency.
import { HttpClient } from '@angular/common/http'; // Mengimpor HttpClient untuk melakukan HTTP request ke server.
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; // Mengimpor modul dan class untuk membuat formulir reaktif.
import * as bootstrap from 'bootstrap'; // Mengimpor Bootstrap untuk manipulasi modal dan elemen lainnya.

@Component({
  selector: 'app-prodi', // Selector untuk komponen ini digunakan dalam template HTML.
  standalone: true, // Menjadikan komponen ini sebagai standalone, tanpa bagian dari modul Angular lainnya.
  imports: [CommonModule, ReactiveFormsModule], // Mengimpor modul Angular yang dibutuhkan untuk komponen ini.
  templateUrl: './prodi.component.html', // Lokasi file template HTML untuk komponen ini.
  styleUrls: ['./prodi.component.css'], // Lokasi file CSS untuk komponen ini.
})
export class ProdiComponent implements OnInit {
  // Mendeklarasikan class komponen dengan implementasi OnInit untuk inisialisasi.
  prodi: any[] = []; // Menyimpan data program studi.
  fakultas: any[] = []; // Menyimpan data fakultas untuk dropdown.
  apiProdiUrl = 'https://crud-express-seven.vercel.app/api/prodi'; // URL API untuk mengambil dan menambahkan data prodi.
  apiFakultasUrl = 'https://crud-express-seven.vercel.app/api/fakultas'; // URL API untuk mengambil data fakultas.
  isLoading = true; // Indikator loading data dari API.
  prodiForm: FormGroup; // Form group untuk formulir reaktif prodi.
  isSubmitting = false; // Indikator proses pengiriman data.

  private http = inject(HttpClient); // Menggunakan Angular inject API untuk menyuntikkan HttpClient.
  private fb = inject(FormBuilder); // Menyuntikkan FormBuilder untuk membangun form reaktif.

  constructor() {
    // Konstruktor untuk inisialisasi komponen.
    this.prodiForm = this.fb.group({
      // Membuat grup form dengan FormBuilder.
      nama: [''], // Field nama prodi.
      singkatan: [''], // Field singkatan prodi.
      fakultas_id: [null], // Field fakultas_id untuk relasi dengan fakultas.
    });
  }

  ngOnInit(): void {
    // Lifecycle method Angular, dipanggil saat komponen diinisialisasi.
    this.getProdi(); // Memanggil fungsi untuk mengambil data prodi.
    this.getFakultas(); // Memanggil fungsi untuk mengambil data fakultas.
  }

  // Mengambil data program studi
  getProdi(): void {
    this.http.get<any[]>(this.apiProdiUrl).subscribe({
      // Melakukan HTTP GET ke API prodi.
      next: (data) => {
        // Callback jika request berhasil.
        this.prodi = data; // Menyimpan data prodi ke variabel.
        this.isLoading = false; // Menonaktifkan indikator loading.
      },
      error: (err) => {
        // Callback jika request gagal.
        console.error('Error fetching prodi data:', err); // Log error ke konsol.
        this.isLoading = false; // Menonaktifkan indikator loading.
      },
    });
  }

  // Mengambil data fakultas untuk dropdown
  getFakultas(): void {
    this.http.get<any[]>(this.apiFakultasUrl).subscribe({
      // Melakukan HTTP GET ke API fakultas.
      next: (data) => {
        // Callback jika request berhasil.
        this.fakultas = data; // Menyimpan data fakultas ke variabel.
      },
      error: (err) => {
        // Callback jika request gagal.
        console.error('Error fetching fakultas data:', err); // Log error ke konsol.
      },
    });
  }

  // Method untuk menambahkan prodi
  addProdi(): void {
    if (this.prodiForm.valid) {
      // Memastikan form valid sebelum mengirim data.
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .post(this.apiProdiUrl, this.prodiForm.value, { headers })
        .subscribe({
          // Melakukan HTTP POST ke API prodi.
          next: (response) => {
            // Callback jika request berhasil.
            console.log('Prodi berhasil ditambahkan:', response); // Log respons ke konsol.
            this.getProdi(); // Refresh data prodi setelah penambahan.
            this.prodiForm.reset(); // Reset form setelah data dikirim.
            this.isSubmitting = false; // Menonaktifkan indikator pengiriman.

            // Tutup modal setelah data berhasil ditambahkan
            const modalElement = document.getElementById(
              'tambahProdiModal'
            ) as HTMLElement; // Ambil elemen modal berdasarkan ID.
            if (modalElement) {
              // Periksa jika elemen modal ada.
              const modalInstance =
                bootstrap.Modal.getInstance(modalElement) ||
                new bootstrap.Modal(modalElement); // Ambil atau buat instance modal.
              modalInstance.hide(); // Sembunyikan modal.

              // Pastikan untuk menghapus atribut dan gaya pada body setelah modal ditutup
              modalElement.addEventListener(
                'hidden.bs.modal',
                () => {
                  // Tambahkan event listener untuk modal yang ditutup.
                  const backdrop = document.querySelector('.modal-backdrop'); // Cari elemen backdrop modal.
                  if (backdrop) {
                    backdrop.remove(); // Hapus backdrop jika ada.
                  }

                  // Pulihkan scroll pada body
                  document.body.classList.remove('modal-open'); // Hapus class 'modal-open' dari body.
                  document.body.style.overflow = ''; // Pulihkan properti overflow pada body.
                  document.body.style.paddingRight = ''; // Pulihkan padding body.
                },
                { once: true }
              ); // Event listener hanya dijalankan sekali.
            }
          },
          error: (err) => {
            // Callback jika request gagal.
            console.error('Error menambahkan prodi:', err); // Log error ke konsol.
            this.isSubmitting = false; // Menonaktifkan indikator pengiriman.
          },
        });
    }
  }
  // Method untuk menghapus prodi
  deleteProdi(_id: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      // Konfirmasi penghapusan
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.delete(`${this.apiProdiUrl}/${_id}`, { headers }).subscribe({
        next: () => {
          console.log(`Prodi dengan ID ${_id} berhasil dihapus`);
          this.getProdi(); // Refresh data prodi setelah penghapusan
        },
        error: (err) => {
          console.error('Error menghapus prodi:', err); // Log error jika penghapusan gagal
        },
      });
    }
  }
  editProdiId: string | null = null; // ID prodi yang sedang diubah

  // Method untuk mendapatkan data prodi berdasarkan ID
  getProdiById(_id: string): void {
    this.editProdiId = _id; // Menyimpan ID prodi yang dipilih
    this.http.get(`${this.apiProdiUrl}/${_id}`).subscribe({
      next: (data: any) => {
        // Isi form dengan data yang diterima dari API
        this.prodiForm.patchValue({
          nama: data.nama,
          singkatan: data.singkatan,
          fakultas_id: data.fakultas_id,
        });

        // Buka modal edit
        const modalElement = document.getElementById(
          'editProdiModal'
        ) as HTMLElement;
        if (modalElement) {
          const modalInstance =
            bootstrap.Modal.getInstance(modalElement) ||
            new bootstrap.Modal(modalElement);
          modalInstance.show();
        }
      },
      error: (err) => {
        console.error('Error fetching prodi data by ID:', err);
      },
    });
  }
  // Method untuk mengupdate data prodi
  updateProdi(): void {
    if (this.prodiForm.valid) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .put(`${this.apiProdiUrl}/${this.editProdiId}`, this.prodiForm.value, {
          headers,
        })
        .subscribe({
          next: (response) => {
            console.log('Prodi berhasil diperbarui:', response);
            this.getProdi(); // Refresh data prodi
            this.isSubmitting = false;

            // Tutup modal edit setelah data berhasil diupdate
            const modalElement = document.getElementById(
              'editProdiModal'
            ) as HTMLElement;
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
          },
          error: (err) => {
            console.error('Error updating prodi:', err);
            this.isSubmitting = false;
          },
        });
    }
  }
}
