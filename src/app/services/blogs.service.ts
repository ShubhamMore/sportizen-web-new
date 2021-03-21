import { Injectable } from "@angular/core"
import { HttpService } from "./shared-services/http.service"


@Injectable({ providedIn: 'root' })
export class BlogsService{
  private blogId: string = null;

  constructor(private httpService: HttpService) {}


  setBlogId(blogId: string) {
    this.blogId = blogId;
  }

  getBlogId() {
    return this.blogId;
  }

  blogsList = [
    {
      "id":"1",
      "blogImage":"https://picsum.photos/900/600",
      "blogCategory":"Football",
      "blogDate":"10/10/20",
      "blogBy":"Sarvesh",
      "blogTitle":"Sports",
      "blogDescription":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },  {
      "id":"2",
      "blogImage":"https://picsum.photos/200/800",
      "blogCategory":"Cricket",
      "blogDate":"10/10/20",
      "blogBy":"Sarvesh",
      "blogTitle":"Sports",
      "blogDescription":"Hello Sports"
    },  {
      "id":"3",
      "blogImage":"https://picsum.photos/200/300",
      "blogCategory":"Cricket",
      "blogDate":"10/10/20",
      "blogBy":"Sarvesh",
      "blogTitle":"Sports",
      "blogDescription":"Hello Sports"
    },  {
      "id":"4",
      "blogImage":"https://picsum.photos/400/400",
      "blogCategory":"Cricket",
      "blogDate":"10/10/20",
      "blogBy":"Sarvesh",
      "blogTitle":"Sports",
      "blogDescription":"Hello Sports"
    },  {
      "id":"5",
      "blogImage":"https://picsum.photos/500/600",
      "blogCategory":"Cricket",
      "blogDate":"10/10/20",
      "blogBy":"Sarvesh",
      "blogTitle":"Sports",
      "blogDescription":"Hello Sports"
    }
  ]

  getBlogsList(){
    return this.blogsList;
  }
  getBlogDetails(){

  }

  getSelectedBlogDetails(){
    return this.blogsList.find(blog=> blog.id==this.blogId)
  }
}
