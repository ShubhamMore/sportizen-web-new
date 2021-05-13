import { CompressImageService } from './../../services/shared-services/compress-image.service';
import { take } from 'rxjs/operators';
export class UploadAdapter {
  private loader: any;

  constructor(loader: any, public compressImageService: CompressImageService) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file: any) =>
        new Promise((resolve, reject) => {
          console.log(file);

          this.compressImageService
            .compress(file)
            .pipe(take(1))
            .subscribe((compressedImage: any) => {
              console.log(compressedImage);
              const myReader = new FileReader();

              myReader.onloadend = (e: any) => {
                // console.log(myReader.result);
                resolve({ default: myReader.result });
              };

              myReader.readAsDataURL(compressedImage);
            });
        })
    );
  }
}
