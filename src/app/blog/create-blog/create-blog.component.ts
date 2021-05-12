import { MatSnackBar } from '@angular/material/snack-bar';
import { BlogsService } from '../../services/blogs.service';
import { BlogModel } from '../../models/blog.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserProfileService } from '../../services/user-profile.service';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { UploadAdapter } from './upload-adapter';
import { take, first } from 'rxjs/operators';
import { CompressImageService } from '../../services/shared-services/compress-image.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageCroperComponent } from 'src/app/image/image-croper/image-croper.component';
import * as ClassicEditor from './../../../assets/vendor/ckeditor';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss'],
})
export class CreateBlogComponent implements OnInit {
  @ViewChild('tag') tag: any;
  @ViewChild('headerImagePicker') headerImagePicker: any;

  loading: boolean;

  tags: string[];

  blogForm: FormGroup;

  headerImageFile: File;
  headerImagePreview: string;

  blog: BlogModel;

  submit: boolean;

  sportizenId: string;
  ckeditorConfig: any;

  public classicEditor: any;

  constructor(
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
    this.submit = false;

    this.ckeditorConfig = {
      toolbar: {
        items: [
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'alignment',
          '|',
          'outdent',
          'indent',
          '|',
          'imageUpload',
          'blockQuote',
          '|',
          'codeBlock',
          'code',
          'insertTable',
          'mediaEmbed',
          'undo',
          'redo',
          'horizontalLine',
          '|',
          'fontFamily',
          'fontBackgroundColor',
          'fontColor',
          'fontSize',
          '|',
          'highlight',
          'htmlEmbed',
          'imageInsert',
          'strikethrough',
          'superscript',
          'underline',
          'todoList',
          'CKFinder',
        ],
      },
      resizeOptions: [
        {
          name: 'resizeImage:original',
          value: null,
          icon: 'original',
        },
        {
          name: 'resizeImage:50',
          value: '50',
          icon: 'medium',
        },
        {
          name: 'resizeImage:75',
          value: '75',
          icon: 'large',
        },
      ],
      language: 'en',
      image: {
        toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
      },
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
      },
    };

    this.userProfileService
      .getUserSportizenId()
      .pipe(first())
      .subscribe((sportizenId: string) => {
        if (sportizenId) {
          this.sportizenId = sportizenId;

          this.classicEditor = ClassicEditor;

          this.tags = [];

          this.blogForm = new FormGroup({
            title: new FormControl(null, {
              validators: [Validators.required, Validators.maxLength(75)],
            }),
            subtitle: new FormControl(null, {
              validators: [Validators.required, Validators.maxLength(150)],
            }),
            description: new FormControl(null, {
              validators: [Validators.required],
            }),
          });

          this.route.params.subscribe((param: Params) => {
            const id = param.id;

            if (id) {
              this.blogService.getBlog(id).subscribe(
                (blog: BlogModel) => {
                  this.titleService.setTitle('SPORTIZEN | Edit Blog | ' + blog.title);
                  this.blog = blog;

                  this.tags = blog.tags;

                  this.blogForm.patchValue({
                    title: blog.title,
                    subtitle: blog.subtitle,
                    description: blog.description,
                  });

                  this.headerImagePreview = this.blog.secureUrl;

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

  addTag(tag: any) {
    if (!tag || !tag.value) {
      return;
    }

    if (this.tags.length < 5) {
      this.tags.push(tag.value.toUpperCase());
      this.tag.nativeElement.value = '';
      return;
    }

    this.snackBar.open("Can't add more than 5 tags", null, {
      duration: 2000,
      panelClass: ['error-snackbar'],
    });
  }

  removeTag(i: number) {
    this.tags.splice(i, 1);
  }

  onReady(eventData: any) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader: any) {
      return new UploadAdapter(loader);
    };
  }

  onImagePicked(event: Event): any {
    const files = (event.target as HTMLInputElement).files;
    const imgExt: string[] = ['jpg', 'jpeg', 'png'];

    const n: number = files.length;

    for (let i = 0; i < n; i++) {
      const fileName = files[i].name;
      const ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

      if (!(imgExt.indexOf(ext) !== -1)) {
        continue;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const preview = reader.result as string;

        const dialogRef = this.dialog.open(ImageCroperComponent, {
          data: {
            image: preview,
            customSavedBtnName: 'Crop',
            customAspectRatio: 2,
          },
          maxHeight: '90vh',
        });

        dialogRef.afterClosed().subscribe((data: any) => {
          if (data) {
            this.headerImagePreview = data;
            this.headerImageFile = this.dataURLtoFile(data as string, this.sportizenId);
          }
        });
      };

      reader.readAsDataURL(files[i]);
    }
  }

  private dataURLtoFile(dataURL: string, filename: string) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  submitBlog() {
    if (this.blogForm.invalid) {
      this.snackBar.open('Blog Description is Required', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
      return;
    } else if (this.tags.length === 0) {
      this.snackBar.open('Blog tags are Required', null, {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
    }
    return;

    this.submit = true;

    if (!this.headerImageFile) {
      this.saveBlog();
      return;
    }

    this.compressImageService
      .compress(this.headerImageFile)
      .pipe(take(1))
      .subscribe((compressedImage) => {
        this.saveBlog(compressedImage);
      });
  }

  private saveBlog(headerImageFile?: File) {
    const blog = new FormData();

    if (this.blog) {
      blog.append('_id', this.blog._id);
    }

    blog.append('title', this.blogForm.value.title);
    blog.append('subtitle', this.blogForm.value.subtitle);
    blog.append('tags', this.tags.join('-'));
    blog.append('description', this.blogForm.value.description);

    if (headerImageFile) {
      blog.append('blogImage', headerImageFile);
    }

    let saveBlogSubscription: any;

    if (!this.blog) {
      saveBlogSubscription = this.blogService.saveBlog(blog);
    } else {
      saveBlogSubscription = this.blogService.updateBlog(blog);
    }

    saveBlogSubscription.subscribe(
      (resBlog: BlogModel) => {
        this.snackBar.open(`Blog ${this.blog ? 'Updated' : 'Created'} Successfully!`, null, {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });

        if (!this.blog) {
          this.blogForm.reset();
          this.location.back();
          return;
        }

        this.blog = resBlog;
        this.headerImagePreview = resBlog.secureUrl;

        this.headerImagePicker.nativeElement.value = '';
        this.headerImageFile = null;
        this.submit = false;
      },
      (error: any) => {
        this.snackBar.open(error, null, {
          duration: 2000,
          panelClass: ['error-snackbar'],
        });
        this.submit = false;
      }
    );
  }
}
