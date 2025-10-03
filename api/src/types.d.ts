/* A */
type ApiRequestOptions = {
  fields: string[];
  populate: string[];
};

type ApiResponse = {
  data: any;
  error: boolean;
  status: number;
  message: string;
};

/* B */
type Bucket = MongoDoc & {
  name: string;
  companyId: string;
  objectCount: number;
  maxSize_bytes: number;
  consumption_bytes: number;
  permissions: BucketPermission[];
};

type BucketPermission = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/* C */
type Company = MongoDoc & {
  name: string;
  userIds: string[];
  bucketIds: string[];
};

/* M */
type MongoDoc = {
  _id: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
};

type MongoProjection = {
  [key: string]: 1 | 0;
};

/* S */
type SimpleError = { error: boolean; message: string };

/* U */
type User = MongoDoc & {
  surname: string;
  username: string;
  firstName: string;
  companyId: string;
  permissions: BucketPermission[];
};
