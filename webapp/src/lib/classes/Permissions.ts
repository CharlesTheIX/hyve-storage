export default class Permissions {
  public static bucket_permissions: { [key: string]: number } = {
    Read: 1,
    Write: 2,
    Update: 3,
    Delete: 4,
    Unknown: 5,
    Unknown_1: 6,
    Unknown_2: 7,
    Unknown_3: 8,
    Full: 9,
  };

  public static getFlatPermissionOptions = (options: Option[], key: "value" | "label", slice?: [number, number]): any[] => {
    const res: any[] = [];
    options.forEach((o) => {
      if (!!o[key]) res.push(o[key]);
    });
    if (slice) return res.slice(...slice);
    return res;
  };

  public static getBucketPermissionLabels = (values?: any[], slice?: [number, number]): string[] => {
    var res: string[] = [];
    Object.keys(this.bucket_permissions).forEach((label: string) => {
      if (!values) return res.push(label);
      if (values.length === 0) return;
      if (typeof values[0] === "number" && values.includes(this.bucket_permissions[label])) return res.push(label);
      if (this.getFlatPermissionOptions(values, "value").includes(this.bucket_permissions[label])) return res.push(label);
    });
    if (slice) return res.slice(...slice);
    return res;
  };

  public static getBucketPermissionValues = (labels?: any[], slice?: [number, number]): number[] => {
    var res: number[] = [];
    Object.keys(this.bucket_permissions).forEach((key) => {
      const item: number = this.bucket_permissions[key];
      if (!labels) return res.push(item);
      if (labels.length === 0) return null;
      if (typeof labels[0] === "string" && labels.includes(key)) return res.push(item);
      if (this.getFlatPermissionOptions(labels, "label").includes(key)) return res.push(item);
    });
    if (slice) res = res.slice(...slice);
    return res as any;
  };

  public static getBucketPermissionOptions = (items?: any[], slice?: [number, number]): Option[] => {
    const res: Option[] = [];
    Object.keys(this.bucket_permissions).forEach((key) => {
      const item: Option = { label: key, value: this.bucket_permissions[key] };
      if (!items) return res.push(item);
      if (items.length === 0) return;
      if (typeof items[0] === "string" && items.includes(key)) return res.push(item);
      if (this.getFlatPermissionOptions(items, "label").includes(key)) return res.push(item);
      if (typeof items[0] === "number" && items.includes(this.bucket_permissions[key])) return res.push(item);
    });
    if (slice) return res.slice(...slice);
    return res;
  };
}
