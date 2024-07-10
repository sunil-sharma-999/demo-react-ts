export type IPermission = {
  id: string;
  name: string;
  label: string;
  guard_name: string;
  is_permission: string;
  display_name: string;
  sub_permissions: Omit<IPermission, "sub_permissions">[];
};

export type IRole = {
  id: string;
  name: string | null;
  guard_name: string | null;
  landing_page: string | null;
};

export type ISampleExcel = {
  sample_brand: string | null;
  sample_color: string | null;
  sample_product: string | null;
  sample_supplier: string | null;
  sample_user: string | null;
};

export type IUser = {
  authorization: string;
  dob: string | null;
  email: string;
  email_verified_at: string;
  gender: string | null;
  gender_text: string | null;
  id: string;
  name: string;
  permissions: IPermission[];
  profile: string;
  profile_original: string | null;
  profile_thumbnail: string | null;
  role: IRole[];
  role_id: string;
  sample_excels: ISampleExcel[];
  status: string;
  status_text: string;
  user_galleries: string[];
  user_pictures: string[];
};
