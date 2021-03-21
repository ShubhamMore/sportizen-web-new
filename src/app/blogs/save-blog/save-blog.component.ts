import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-save-blog',
  templateUrl: './save-blog.component.html',
  styleUrls: ['./save-blog.component.scss']
})
export class SaveBlogComponent implements OnInit {

  invalidImage: boolean;
  blogImageFiles: File[];
  blogImagePreview: string[];
  form: FormGroup;
  loading: boolean;
  blog:any;
  savingRecord: boolean;
  editingMode: boolean;
  public Editor = ClassicEditor;
  @ViewChild('myEditor') myEditor: any;
  constructor() { }

  ngOnInit(): void {

    this.blog={};
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required],
      })
    });
    this.savingRecord = false;
    this.editingMode = false;
    this.blog.images = [];
    this.loading= true;
    this.blogImageFiles = [];
    this.blogImagePreview = [];

  }

  saveBlog() {
    if (this.form.valid) {
      this.savingRecord = true;
      const blog = new FormData();
      if (this.blog && this.editingMode) {
        blog.append('_id', this.blog._id);
      }
      blog.append('title',this.form.value.title);
      for (let i = 0; i < this.blogImageFiles.length; i++) {
        blog.append('blogImage', this.blogImageFiles[i]);
      }
      blog.append('blogContent',this.getBlogContent());

      console.log(blog);
    }

  }

  private getBlogContent() {
    if (this.myEditor && this.myEditor.editorInstance) {
      return this.myEditor.editorInstance.getData();
    }

    return '';
  }



  onImagePicked(event: Event): any {
    this.invalidImage = false;
    const files = (event.target as HTMLInputElement).files;
    const imgExt: string[] = ['jpg', 'png'];
    let ext: string;
    const n: number = files.length;
    for (let i = 0; i < n; i++) {
      ext = files[i].name.substring(files[i].name.lastIndexOf('.') + 1).toLowerCase();
      if (!(imgExt.indexOf(ext) !== -1)) {
        return (this.invalidImage = true);
      }
    }

    this.invalidImage = false;

    for (let i = 0; i < n; i++) {
      this.blogImageFiles.push(files[i]);
      const reader = new FileReader();
      reader.onload = () => {
        this.blogImagePreview.push(reader.result as string);
      };
      reader.readAsDataURL(files[i]);
    }
  }


  removeImage(i: number) {
    this.blogImageFiles.splice(i, 1);
    this.blogImagePreview.splice(i, 1);
  }

  deleteImage(id: string, imageId: string, i: number) {
    this.loading = true;
    // this.eventService.deleteEventImage(id, imageId, i).subscribe(
    //   (res: any) => {
    //     this.event.images.splice(i, 1);
    //     this.loading = false;
    //   },
    //   (error: any) => {
    //     this.loading = false;
    //   }
    // );
  }
}
