import multer from "multer";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import uuid from "uuid";
import { Router, Request, Response } from "express";
dotenv.config();
const uploadHandler = Router();
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");
const Uploader = (req: Request, res: Response) => {
    let myFile = req.file!.originalname.split(".");
    const fileType = myFile[myFile.length - 1];

    console.log("Abhinav", req.file);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `${uuid}.${fileType}`,
      Body: req.file?.buffer,
    };
    s3.upload(params, (error: any, data: any) => {
      if (error) {
        res.status(500).send(error);
      }
      res.status(200).send(data);
    });
  }
const getImageHandler = async(req:Request,res:Response) =>{
  const key = req.params.key;
  const params = {
    Key:key,
    Bucket:process.env.AWS_BUCKET_NAME!
  };
  s3.getObject(params,(err,data)=>{
    if(err){
      return res.send(err);
    }
    res.send({data});
  })
}
uploadHandler.post('/upload',upload,Uploader);
uploadHandler.get("/:key",getImageHandler)
export default uploadHandler;