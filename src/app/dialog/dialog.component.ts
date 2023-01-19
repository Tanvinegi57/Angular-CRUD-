import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  productForm!: FormGroup;
  actionBtn: string = 'Save';
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      date: ['', Validators.required],
      productFreshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = 'Update';
      this.productForm.controls['productName'].setValue(
        this.editData.productName
      );
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['productFreshness'].setValue(
        this.editData.productFreshness
      );
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
    }
  }

  freshnessList = ['Brand New', 'Second Hand', 'Refurbished'];

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            alert('product added.');
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            console.log('Something went wrong');
          },
        });
      }
    } else {
      this.updateProduct();
    }
  }

  updateProduct() {
    this.api.updateProduct(this.productForm.value, this.editData.id).subscribe({
      next: (res) => {
        alert('Updation Successful.');
        this.productForm.reset();
        this.dialogRef.close('Updated');
      },
      error: () => console.log("Can't perform updation."),
    });
  }
}
