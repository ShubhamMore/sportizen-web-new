import { MatSnackBar } from '@angular/material/snack-bar';
import { BlogsService } from '../../services/blogs.service';
import { BlogModel } from '../../models/blog.model';
import { SportService } from '../../services/sport.service';
import { SportModel } from '../../models/sport.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserProfileService } from '../../services/user-profile.service';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { UploadAdapter } from './upload-adapter';
import { take, first } from 'rxjs/operators';
import { CompressImageService } from '../../services/shared-services/compress-image.service';
import { ImageModelComponent } from '../../image/image-model/image-model.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../@shared/confirm/confirm.component';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss'],
})
export class CreateBlogComponent implements OnInit {
  loading: boolean;
  loadingImages: boolean;

  blogImageFiles: File[];
  blogImagePreview: string[];
  invalidImage: boolean;

  sports: SportModel[];

  detailsForm: FormGroup;
  blogForm: FormGroup;

  blog: BlogModel;

  submit: boolean;

  sportizenId: string;

  ckeditorConfig: any;

  public classicEditor: any;

  constructor(
    private sportsService: SportService,
    private blogService: BlogsService,
    private location: Location,
    private userProfileService: UserProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private compressImageService: CompressImageService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadingImages = false;

    this.submit = false;

    this.ckeditorConfig = {
      toolbar: [
        'heading',
        // 'fontFamily',
        // 'fontSize',
        '|',
        'bold',
        'italic',
        // 'underline',
        // 'fontColor',
        // 'fontBackgroundColor',
        // 'highlight',
        'link',
        '|',
        // 'CKFinder',
        'imageUpload',
        // 'mediaEmbed',
        '|',
        'blockQuote',
        // 'alignment',
        'bulletedList',
        'numberedList',
        '|',
        'indent',
        'outdent',
        '|',
        'undo',
        'redo',
        // '|',
        // 'insertTable',
        // 'specialCharacters',
      ],
      language: 'id',
      image: {
        toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
        styles: ['full', 'side'],
      },
      // image: {
      //   // Configure the available styles.
      //   styles: ['alignLeft', 'alignCenter', 'alignRight'],

      //   // Configure the available image resize options.
      //   resizeOptions: [
      //     {
      //       name: 'resizeImage:original',
      //       label: 'Original',
      //       value: null,
      //     },
      //     {
      //       name: 'resizeImage:50',
      //       label: '50%',
      //       value: '50',
      //     },
      //     {
      //       name: 'resizeImage:75',
      //       label: '75%',
      //       value: '75',
      //     },
      //   ],

      //   // You need to configure the image toolbar, too, so it shows the new style
      //   // buttons as well as the resize buttons.
      //   toolbar: [
      //     'imageStyle:alignLeft',
      //     'imageStyle:alignCenter',
      //     'imageStyle:alignRight',
      //     '|',
      //     'resizeImage',
      //     '|',
      //     'imageTextAlternative',
      //   ],
      // },
    };

    this.userProfileService
      .getUserSportizenId()
      .pipe(first())
      .subscribe((sportizenId: string) => {
        if (sportizenId) {
          this.sportizenId = sportizenId;

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
              this.blogService.getBlog(id).subscribe(
                (blog: BlogModel) => {
                  this.titleService.setTitle('SPORTIZEN | Edit Blog | ' + blog.title);
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
                  this.router.navigate(['./../../'], { relativeTo: this.route, replaceUrl: true });
                }
              );
            } else {
              this.titleService.setTitle('SPORTIZEN | New Blog');

              this.loading = false;
            }
          });
        } else {
          this.location.back();
        }
      });
  }

  onReady(eventData: any) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader: any) {
      return new UploadAdapter(loader);
    };
  }

  removeImage(i: number) {
    this.blogImageFiles.splice(i, 1);
    this.blogImagePreview.splice(i, 1);
  }

  deleteImage(id: string, imageId: string, i: number) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { message: 'Do you want to delete This Image?' },
      maxHeight: '90vh',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.loadingImages = true;
        this.blogService.deleteBlogImage(id, imageId, i).subscribe(
          (res: any) => {
            this.blog.images.splice(i, 1);
            this.loadingImages = false;
          },
          (error: any) => {
            this.loadingImages = false;
          }
        );
      }
    });
  }

  openImageModel(image: any) {
    const dialogRef = this.dialog.open(ImageModelComponent, {
      data: { image },
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  onImagePicked(event: Event): any {
    this.loadingImages = true;

    const files = (event.target as HTMLInputElement).files;
    const imgExt: string[] = ['jpg', 'jpeg', 'png'];

    const n: number = files.length;

    for (let i = 0; i < n; i++) {
      const fileName = files[i].name;
      const ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

      if (!(imgExt.indexOf(ext) !== -1)) {
        this.invalidImage = true;
        continue;
      }

      this.blogImageFiles.push(files[i]);

      const reader = new FileReader();

      reader.onload = () => {
        const preview = reader.result as string;
        this.blogImagePreview.push(preview);

        if (i === n - 1) {
          this.loadingImages = false;
        }
      };

      reader.readAsDataURL(files[i]);
    }
  }

  submitBlog() {
    if (this.detailsForm.invalid) {
      this.snackBar.open('Form Details are Required', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
      return;
    } else if (this.blogForm.invalid) {
      this.snackBar.open('Blog Description is Required', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.submit = true;

    const n = this.blogImageFiles.length;

    if (n === 0) {
      this.saveBlog();
      return;
    }

    const blogImageFiles: File[] = [];

    for (let i = 0; i < n; i++) {
      this.compressImageService
        .compress(this.blogImageFiles[i])
        .pipe(take(1))
        .subscribe((compressedImage) => {
          blogImageFiles.push(compressedImage);

          if (i === n - 1) {
            this.saveBlog(blogImageFiles);
          }
        });
    }
  }

  private saveBlog(blogImageFiles?: File[]) {
    const blog = new FormData();

    if (this.blog) {
      blog.append('_id', this.blog._id);
    }

    blog.append('title', this.detailsForm.value.title);
    blog.append('subtitle', this.detailsForm.value.subtitle);
    blog.append('sport', this.detailsForm.value.sport);

    for (const blogImageFile of blogImageFiles) {
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
        this.submit = false;
        this.loading = false;
      }
    );
  }
}
