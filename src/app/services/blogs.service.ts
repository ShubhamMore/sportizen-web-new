import { map, catchError } from 'rxjs/operators';
import { BlogModel } from './../models/blog.model';
import { Injectable } from '@angular/core';
import { HttpService } from './shared-services/http.service';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogsService {
  constructor(private httpService: HttpService) {}

  saveBlog(blog: FormData) {
    const data = { api: 'create-blog', data: blog };

    return this.httpService.httpPost(data).pipe(
      map((resBlog: BlogModel) => {
        return resBlog;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  updateBlog(blog: FormData) {
    const data = { api: 'update-blog', data: blog };

    return this.httpService.httpPost(data).pipe(
      map((resBlog: BlogModel) => {
        return resBlog;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getMyBlogs(limit?: number, skip?: number) {
    const data = { api: `get-my-blogs/${limit}/${skip}`, data: { limit, skip } };
    return this.httpService.httpGet(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  getBlogs(limit?: number, skip?: number) {
    const data = { api: `get-blogs/${limit}/${skip}`, data: { limit, skip } };
    return this.httpService.httpGet(data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  // getBlogForUser(id: string) {
  //   const data = { api: 'get-blog', data: { id } };
  //   return this.httpService.httpPost(data).pipe(
  //     map((response: any) => {
  //       return response;
  //     }),
  //     catchError((err: any) => {
  //       return throwError(err);
  //     })
  //   );
  // }

  getBlog(id: string) {
    const data = { api: `get-blog/${id}`, data: { id } };
    return this.httpService.httpGet(data).pipe(
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
      api: 'delete-blog-image',
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
