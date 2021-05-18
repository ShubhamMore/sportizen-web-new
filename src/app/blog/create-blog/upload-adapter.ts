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
          this.compressImageService
            .compress(file)
            .pipe(take(1))
            .subscribe((compressedImage: any) => {
              const myReader = new FileReader();

              myReader.onloadend = (e: any) => {
                resolve({ default: myReader.result });
              };

              myReader.readAsDataURL(compressedImage);
            });
        })
    );
  }
}
