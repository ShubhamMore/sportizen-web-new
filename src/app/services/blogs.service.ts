import { map, catchError } from 'rxjs/operators';
import { BlogModel } from './../models/blog.model';
import { Injectable } from '@angular/core';
import { HttpService } from './shared-services/http.service';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogsService {
  private blogId: string;

  private blogsList: BlogModel[] = [
    {
      _id: '1',
      images: [
        {
          _id: '',
          imageName: '',
          secureUrl: 'https://picsum.photos/900/600',
          publicId: '',
          createdAt: '',
        },
        {
          _id: '',
          imageName: '',
          secureUrl: 'https://picsum.photos/600/600',
          publicId: '',
          createdAt: '',
        },
        {
          _id: '',
          imageName: '',
          secureUrl: 'https://picsum.photos/300/600',
          publicId: '',
          createdAt: '',
        },
      ],
      createdBy: '',
      modifiedAt: '10/10/20',
      subtitle: 'Football',
      createdAt: '10/10/20',
      createdUser: 'Sarvesh',
      title: 'Sports',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      _id: '2',
      images: [
        // {
        //   _id: '',
        //   imageName: '',
        //   secureUrl: 'https://picsum.photos/200/800',
        //   publicId: '',
        //   createdAt: '',
        // },
      ],
      createdBy: '',
      modifiedAt: '10/10/20',
      subtitle: 'Cricket',
      createdAt: '10/10/20',
      createdUser: 'Sarvesh',
      title: 'Sports',
      description: 'Hello Sports',
    },
    {
      _id: '3',
      images: [
        {
          _id: '',
          imageName: '',
          secureUrl: 'https://picsum.photos/200/300',
          publicId: '',
          createdAt: '',
        },
      ],
      createdBy: '',
      modifiedAt: '10/10/20',
      subtitle: 'Cricket',
      createdAt: '10/10/20',
      createdUser: 'Sarvesh',
      title: 'Sports',
      description: 'Hello Sports',
    },
    {
      _id: '4',
      images: [
        {
          _id: '',
          imageName: '',
          secureUrl: 'https://picsum.photos/400/400',
          publicId: '',
          createdAt: '',
        },
      ],
      createdBy: '',
      modifiedAt: '10/10/20',
      subtitle: 'Cricket',
      createdAt: '10/10/20',
      createdUser: 'Sarvesh',
      title: 'Sports',
      description: 'Hello Sports',
    },
    {
      _id: '5',
      images: [
        {
          _id: '',
          imageName: '',
          secureUrl: 'https://picsum.photos/500/600',
          publicId: '',
          createdAt: '',
        },
      ],
      createdBy: '',
      modifiedAt: '10/10/20',
      subtitle: 'Cricket',
      createdAt: '10/10/2020',
      createdUser: 'Sarvesh',
      title: 'Sports',
      description: 'Hello Sports',
    },
  ];

  setBlogId(blogId: string) {
    this.blogId = blogId;
  }

  getBlogId() {
    return this.blogId;
  }

  getBlogsList() {
    return [...this.blogsList];
  }
  getBlogDetails() {}

  getSelectedBlogDetails() {
    return this.blogsList.find((blog: BlogModel) => blog._id === this.blogId);
  }

  constructor(private httpService: HttpService) {}

  saveBlog(blog: FormData, editingMode: boolean) {
    let data = { api: 'createBlog', data: blog };
    if (editingMode) {
      data = { api: 'updateBlog', data: blog };
    }
    return this.httpService.httpPost(data).pipe(
      map((resBlog: BlogModel) => {
        return resBlog;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getMyBlogs(limit?: number) {
    const data = { api: 'get-my-blogs', data: { limit } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getBlogs(limit?: number) {
    const data = { api: 'get-blogs', data: { limit } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getBlog(id: string) {
    const data = { api: 'get-blog', data: { id } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  deleteBlog(id: string) {
    const data = { api: 'delete-blog', data: { id } };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  deleteBlogImage(id: string, imageId: string, index: number) {
    const data = {
      api: 'deleteBlogImage',
      data: { id, imageId, index },
    };
    return this.httpService.httpPost(data).pipe(
      map((response: any) => {
        // const eventIndex = this.events.findIndex((event) => event._id === id);
        // this.events[eventIndex].images.splice(index, 1);
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }
}
