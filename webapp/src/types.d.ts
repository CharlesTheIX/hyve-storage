/* A */
type ApiRequestFilters = {
  skip: number;
  limit: number;
  fields: string[];
  populate: string[];
  sort: { order: "asc" | "desc"; field: string };
};

type ApiResponse = {
  data: any;
  error: boolean;
  status: number;
  message: string;
  meta?: Partial<ApiResponseMeta>;
};

type ApiResponseMeta = {
  collection_count: number;
};

/* B */
type Bucket = MongoDoc & {
  name: string;
  object_count: number;
  permissions: number[];
  max_size_bytes: number;
  consumption_bytes: number;
  company_id: string | Partial<Company>;
};

type BucketPermission = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/* C */
type Company = MongoDoc & {
  name: string;
  user_ids: string[] | Partial<User>[];
  bucket_ids: string[] | Partial<Bucket>[];
};

/* D */
type DataType = "user" | "company" | "bucket" | "object";

/* F */
type SimpleError = {
  error: boolean;
  title?: string;
  message: string;
};

/* M */
type MinioObject = {
  etag: string;
  name: string;
  size: number;
  lastModified: Date;
};

type MinioObjectUploadRequest = {
  file: File;
  bucket_name: string;
  from_source: string;
  object_name: string;
};

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
  time_stamp: number;
};

/* T */
type TableHeader = Option & {
  visible?: boolean;
  sortable?: boolean;
  permissions?: number[];
};

type TableType = "users" | "buckets" | "companies" | "objects";

type ToastItem = {
  title: string;
  type: ToastType;
  content: string;
  timeout: number;
  visible: boolean;
};

type ToastType = "success" | "error";

/* U */
type User = MongoDoc & {
  surname: string;
  username: string;
  first_name: string;
  permissions: number[];
  company_id: string | Partial<Company>;
};
