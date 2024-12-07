import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class StorageService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    const params = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: `${path}/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const { Location } = await this.s3.upload(params).promise();
    return Location;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const key = fileUrl.split('/').slice(-1)[0];
    const params = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }
}
