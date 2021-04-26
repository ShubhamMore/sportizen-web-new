import { MatSnackBar } from '@angular/material/snack-bar';
import { BlogsService } from './../../../../services/blogs.service';
import { BlogModel } from './../../../../models/blog.model';
import { SportService } from './../../../../services/sport.service';
import { SportModel } from './../../../../models/sport.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute, Params, Router } from '@angular/router';

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

  detailsForm: FormGroup;
  blogForm: FormGroup;

  blog: BlogModel;

  submit: boolean;

  public classicEditor: any;

  constructor(
    private sportsService: SportService,
    private blogService: BlogsService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.submit = false;

    this.classicEditor = ClassicEditor;

    this.sports = this.sportsService.getSports();

    this.detailsForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required],
      }),
      subtitle: new FormControl(null, {
        validators: [Validators.required],
      }),
      sport: new FormControl('', {
        validators: [Validators.required],
      }),
    });

    this.blogForm = new FormGroup({
      description: new FormControl(null, {
        validators: [Validators.required],
      }),
    });

    this.blogImageFiles = [];
    this.blogImagePreview = [];

    this.route.params.subscribe((param: Params) => {
      const id = param.id;

      if (id) {
        this.blogService.getBlogForUser(id).subscribe(
          (blog: BlogModel) => {
            this.blog = blog;
            this.detailsForm.patchValue({
              title: blog.title,
              subtitle: blog.subtitle,
              sport: blog.sport,
            });

            this.blogForm.patchValue({
              description: blog.description,
            });

            this.loading = false;
          },
          (error: any) => {
            this.router.navigate(['../../'], { relativeTo: this.route, replaceUrl: true });
          }
        );
      } else {
        this.loading = false;
      }
    });
  }

  saveBlog() {
    if (this.detailsForm.invalid) {
      this.snackBar.open('Form Details are Required', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
    } else if (this.blogForm.invalid) {
      this.snackBar.open('Blog Description is Required', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
    } else {
      this.submit = true;

      const blog = new FormData();

      if (this.blog) {
        blog.append('_id', this.blog._id);
      }

      blog.append('title', this.detailsForm.value.title);
      blog.append('subtitle', this.detailsForm.value.subtitle);
      blog.append('sport', this.detailsForm.value.sport);

      for (const blogImageFile of this.blogImageFiles) {
        blog.append('blogImage', blogImageFile);
      }

      blog.append('description', this.blogForm.value.description);

      this.blogService.saveBlog(blog, !!this.blog).subscribe(
        (resBlog: BlogModel) => {
          this.snackBar.open(`Blog ${this.blog ? 'Updated' : 'Created'} Successfully!`, null, {
            duration: 2000,
            panelClass: ['success-snackbar'],
          });

          if (!this.blog) {
            this.detailsForm.reset();
            this.blogForm.reset();
          } else {
            this.blog = resBlog;
            this.blog.images = resBlog.images;
          }

          this.blogImageFiles = [];
          this.blogImagePreview = [];

          this.submit = false;
        },
        (error: any) => {
          this.snackBar.open(error, null, {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
          this.loading = false;
        }
      );
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
