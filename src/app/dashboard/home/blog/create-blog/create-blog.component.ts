import { BlogsService } from './../../../../services/blogs.service';
import { BlogModel } from './../../../../models/blog.model';
import { SportService } from './../../../../services/sport.service';
import { SportModel } from './../../../../models/sport.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss'],
})
export class CreateBlogComponent implements OnInit {
  loading: boolean;

  blogImageFiles: File[];
  blogImagePreview: string[];
  invalidImage: boolean;

  sports: SportModel[];

  form: FormGroup;

  blog: BlogModel;

  submit: boolean;

  public classicEditor: any;

  constructor(private sportsService: SportService, private blogService: BlogsService) {}

  ngOnInit(): void {
    this.loading = true;
    this.submit = false;

    this.classicEditor = ClassicEditor;

    this.sports = this.sportsService.getSports();

    this.loading = false;
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required],
      }),
      subtitle: new FormControl(null, {
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        validators: [Validators.required],
      }),
      sport: new FormControl('', {
        validators: [Validators.required],
      }),
    });

    this.blogImageFiles = [];
    this.blogImagePreview = [];

    this.loading = false;
  }

  saveBlog() {
    if (this.form.valid) {
      this.submit = true;
      const blog = new FormData();
      if (this.blog) {
        blog.append('_id', this.blog._id);
      }
      blog.append('title', this.form.value.title);
      blog.append('subtitle', this.form.value.subtitle);
      blog.append('sport', this.form.value.sport);
      for (const blogImageFile of this.blogImageFiles) {
        blog.append('blogImage', blogImageFile);
      }
      blog.append('description', this.form.value.description);

      // this.blogService.saveBlog(blog, !!this.blog).subscribe(
      //   (resBlog: BlogModel) => {
      //     if (!this.blog) {
      //       this.form.reset();
      //     } else {
      //       this.blog = resBlog;
      //       this.blog.images = resBlog.images;
      //     }
      //     this.submit = false;
      //     this.blogImageFiles = [];
      //     this.blogImagePreview = [];
      //   },
      //   (error: any) => {
      //     this.loading = false;
      //   }
      // );
    }
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
    this.blogService.deleteBlogImage(id, imageId, i).subscribe(
      (res: any) => {
        this.blog.images.splice(i, 1);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }
}
