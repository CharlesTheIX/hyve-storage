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
  objectCount: number;
  maxSize_bytes: number;
  consumption_bytes: number;
  permissions: BucketPermission[];
  companyId: string | Partial<Company>;
};

type BucketListData = {
  name: string;
  creationDate: string;
};

type BucketPermission = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/* C */
type Company = MongoDoc & {
  name: string;
  userIds: string[] | Partial<User>[];
  bucketIds: string[] | Partial<Bucket>[];
};

/* F */
type FormError = {
  error: boolean;
  title?: string;
  message: string;
};

/* M */
type MongoDoc = {
  _id: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
};

/* O */
type Option = {
  label: string;
  value: string | number;
};

/* S */
type StorageValue = {
  value: any;
  timeStamp: number;
};

/* U */
type User = MongoDoc & {
  surname: string;
  username: string;
  firstName: string;
  permissions: BucketPermission[];
  companyId: string | Partial<Company>;
};
