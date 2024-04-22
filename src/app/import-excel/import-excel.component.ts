import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../data/myConst';


@Component({
  standalone: true,
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.css']
})
export class ImportExcelComponent implements OnInit {
  @Input() safeId: string | undefined;
  file: File | null = null;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  onSubmit() {
    if (!this.file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file);

    const safeId = this.safeId; // Replace 'your-safe-id' with actual safe ID
    const url = `${API_BASE_URL}api/Record/Import/Import?safeId=${safeId}`;

    this.http.post(url, formData)
      .subscribe(
        (response) => {
          console.log('Import successful:', response);
          alert('Import successful!');
        },
        (error) => {
          console.error('Import failed:', error);
          alert('Import failed. Please try again.');
        }
      );
  }
}
